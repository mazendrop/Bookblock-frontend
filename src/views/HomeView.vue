<script setup>
import { ref, onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'

const books = ref([])
const title = ref('')
const author = ref('')

async function loadBooks() {
  const res = await fetch(`${baseUrl}/books`)
  books.value = await res.json()
}

async function addBook() {
  await fetch(`${baseUrl}/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      title: title.value,
      author: author.value,
      readingStatus: 'WANT_TO_READ'
    })
  })
  title.value = ''
  author.value = ''
  await loadBooks()
}

onMounted(loadBooks)
</script>

<template>
  <h1>BookBlock</h1>

  <form @submit.prevent="addBook">
    <input v-model="title" placeholder="Titel" required />
    <input v-model="author" placeholder="Autor" required />
    <button type="submit">Buch speichern</button>
  </form>

  <BookCard
    v-for="book in books"
    :key="book.id"
    :book="book"
  />
</template>
