// Mini-Store: geteilter Zustand ohne externe Library

import { reactive } from 'vue'
import { fetchBooks, type BookEntry } from './api'

export const store = reactive({
  books: [] as BookEntry[],
  loaded: false,

  async load() {
    this.books = await fetchBooks()
    this.loaded = true
  },

  /** Leert die Liste - z. B. beim Wechsel des angemeldeten Nutzers. */
  reset() {
    this.books = []
    this.loaded = false
  },

  isSaved(title: string, author: string): boolean {
    const t = title.trim().toLowerCase()
    const a = author.trim().toLowerCase()
    return this.books.some(
      (b) => b.title.trim().toLowerCase() === t && b.author.trim().toLowerCase() === a,
    )
  },
})

// ---------- Toasts ----------

export interface Toast {
  id: number
  message: string
  error: boolean
}

export const toasts = reactive<Toast[]>([])

let toastId = 0

export function showToast(message: string, error = false) {
  const id = ++toastId
  toasts.push({ id, message, error })
  setTimeout(() => {
    const i = toasts.findIndex((t) => t.id === id)
    if (i !== -1) toasts.splice(i, 1)
  }, 2600)
}
