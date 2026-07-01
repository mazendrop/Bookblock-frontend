// Zentrale API-Schicht: Backend (eigene REST-API) + Google Books

export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

export interface BookEntry {
  id?: number
  title: string
  author: string
  readingStatus: string
  thumbnail?: string | null
  description?: string | null
}

export async function fetchBooks(): Promise<BookEntry[]> {
  const res = await fetch(`${BASE_URL}/books`)
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  return res.json()
}

export async function saveBook(book: BookEntry): Promise<BookEntry> {
  const res = await fetch(`${BASE_URL}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(book),
  })
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  return res.json()
}

export async function updateBookStatus(id: number, readingStatus: string): Promise<BookEntry> {
  const res = await fetch(`${BASE_URL}/books/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ readingStatus }),
  })
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
  return res.json()
}

export async function deleteBookById(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/books/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error(`Backend error: ${res.status}`)
}

// ---------- Google Books ----------

export interface SearchResult {
  googleId: string
  title: string
  authors: string
  description: string
  thumbnail: string | null
  publishedDate: string
  averageRating: number | null
}

const GOOGLE_BOOKS_KEY = import.meta.env.VITE_GOOGLE_BOOKS_KEY || ''

if (!GOOGLE_BOOKS_KEY) {
  // Ohne Key limitiert Google pro IP sehr streng -> häufige 429-Fehler.
  // Vite liest .env.local nur beim Start -> nach Änderung Dev-Server neu starten!
  console.warn(
    '[BookBlock] Kein VITE_GOOGLE_BOOKS_KEY gesetzt. Suchen werden ohne API-Key ' +
      'ausgeführt und schnell rate-limited (429). .env.local prüfen und Dev-Server neu starten.',
  )
}

export const PAGE_SIZE = 12

export interface SearchPage {
  results: SearchResult[]
  totalItems: number
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function searchGoogleBooks(query: string, page = 1): Promise<SearchPage> {
  const startIndex = (page - 1) * PAGE_SIZE
  const params = `q=intitle:${encodeURIComponent(query)}&maxResults=${PAGE_SIZE}&startIndex=${startIndex}&country=US`
  const baseUrl = `https://www.googleapis.com/books/v1/volumes?${params}`
  // Key behalten! Ein 429 verschwindet nicht dadurch, dass man den Key weglässt —
  // ohne Key ist das IP-Limit noch strenger. Stattdessen mit Backoff erneut versuchen.
  const url = GOOGLE_BOOKS_KEY ? `${baseUrl}&key=${GOOGLE_BOOKS_KEY}` : baseUrl

  let res!: Response
  const MAX_TRIES = 3
  for (let attempt = 0; attempt < MAX_TRIES; attempt++) {
    res = await fetch(url)
    if (res.status !== 429) break
    if (attempt < MAX_TRIES - 1) await sleep(600 * 2 ** attempt) // 600ms, 1.2s
  }

  if (!res.ok) {
    if (res.status === 429) {
      throw new Error(
        GOOGLE_BOOKS_KEY
          ? 'Google Books drosselt gerade (Tageskontingent des Keys evtl. erschöpft). Kurz warten und erneut versuchen.'
          : 'Kein API-Key aktiv — Google drosselt anonyme Anfragen. Key in .env.local setzen und Dev-Server neu starten.',
      )
    }
    if (res.status === 400 || res.status === 403) {
      throw new Error(
        `Google Books lehnt den API-Key ab (${res.status}). Prüfe: Books API aktiviert? ` +
          `Key-Einschränkungen (HTTP-Referrer/API) korrekt?`,
      )
    }
    throw new Error(`Google Books error: ${res.status}`)
  }
  const data = await res.json()
  if (!data.items) return { results: [], totalItems: 0 }

  const results = data.items.map((item: any): SearchResult => {
    const info = item.volumeInfo || {}
    return {
      googleId: item.id,
      title: info.title || 'Untitled',
      authors: info.authors ? info.authors.join(', ') : 'Unknown author',
      description: info.description || 'No description available.',
      thumbnail: info.imageLinks
        ? (info.imageLinks.thumbnail || info.imageLinks.smallThumbnail).replace('http://', 'https://')
        : null,
      publishedDate: info.publishedDate || 'n/a',
      averageRating: info.averageRating || null,
    }
  })

  return { results, totalItems: data.totalItems ?? results.length }
}
