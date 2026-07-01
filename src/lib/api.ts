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

export const PAGE_SIZE = 12

export interface SearchPage {
  results: SearchResult[]
  totalItems: number
}

export async function searchGoogleBooks(query: string, page = 1): Promise<SearchPage> {
  const startIndex = (page - 1) * PAGE_SIZE
  const params = `q=intitle:${encodeURIComponent(query)}&maxResults=${PAGE_SIZE}&startIndex=${startIndex}`
  const baseUrl = `https://www.googleapis.com/books/v1/volumes?${params}`

  // Erst mit Key (falls vorhanden), bei 403/429 ohne Key erneut versuchen — und umgekehrt
  let res = await fetch(GOOGLE_BOOKS_KEY ? `${baseUrl}&key=${GOOGLE_BOOKS_KEY}` : baseUrl)
  if ((res.status === 403 || res.status === 429) && GOOGLE_BOOKS_KEY) {
    res = await fetch(baseUrl)
  }
  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? 'Google Books is rate-limiting right now — wait a few seconds and try again.'
        : `Google Books error: ${res.status}`,
    )
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
