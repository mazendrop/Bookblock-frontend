<script setup>
defineProps({
  book: Object
})
</script>

<template>
  <div class="card">
    <h3>{{ book.title }}</h3>
    <p>{{ book.author }}</p>
    <small>{{ book.readingStatus }}</small>
  </div>
</template>

<style>
.card {
  border: 2px solid black;
  padding: 10px;
  margin: 10px 0;
}
</style>
