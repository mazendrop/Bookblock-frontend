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

export const PAGE_SIZE = 12

export interface SearchPage {
  results: SearchResult[]
  totalItems: number
}

// Die Suche läuft jetzt über das eigene Backend (/search). Der Google-API-Key
// liegt server-seitig und ist im Frontend-Bundle nicht mehr sichtbar.
export async function searchGoogleBooks(query: string, page = 1): Promise<SearchPage> {
  const params = `q=${encodeURIComponent(query)}&page=${page}`
  const res = await fetch(`${BASE_URL}/search?${params}`)

  if (!res.ok) {
    throw new Error(
      res.status === 429
        ? 'Google Books drosselt gerade — kurz warten und erneut versuchen.'
        : `Suche fehlgeschlagen: ${res.status}`,
    )
  }
  return res.json()
}
