<script setup>
import { ref } from 'vue'
import BookCard from '../components/BookCard.vue'

const books = ref([
  {
    id: 1,
    volumeInfo: {
      title: "Atomic Habits",
      authors: ["James Clear"]
    }
  },
  {
    id: 2,
    volumeInfo: {
      title: "Clean Code",
      authors: ["Robert C. Martin"]
    }
  }
])
</script>

<template>
  <h1>BookBlock</h1>

  <BookCard
    v-for="book in books"
    :key="book.id"
    :book="book"
  />
</template>
