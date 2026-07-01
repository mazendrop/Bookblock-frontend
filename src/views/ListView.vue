<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'
import { updateBookStatus, deleteBookById, type BookEntry } from '../lib/api'
import { store, showToast } from '../lib/store'
import { i18n } from '../lib/i18n'

const FILTERS = ['ALL', 'WANT_TO_READ', 'READING', 'FINISHED'] as const
const activeFilter = ref<string>('ALL')
const loading = ref(false)

const filteredBooks = computed(() =>
  activeFilter.value === 'ALL'
    ? store.books
    : store.books.filter((b) => b.readingStatus === activeFilter.value),
)

onMounted(async () => {
  loading.value = true
  try {
    await store.load()
  } catch {
    showToast(i18n.t('toast.backend'), true)
  } finally {
    loading.value = false
  }
})

function filterLabel(f: string) {
  return f === 'ALL' ? i18n.t('filter.ALL') : i18n.t(`status.${f}`)
}

async function handleStatusChange(book: BookEntry, status: string) {
  try {
    const updated = await updateBookStatus(book.id!, status)
    const i = store.books.findIndex((b) => b.id === book.id)
    if (i !== -1) store.books[i] = updated
    showToast(i18n.t('toast.status'))
  } catch {
    showToast(i18n.t('toast.backend'), true)
  }
}

async function handleDelete(book: BookEntry) {
  try {
    await deleteBookById(book.id!)
    store.books = store.books.filter((b) => b.id !== book.id)
    showToast(`"${book.title}" ${i18n.t('toast.removed')}`)
  } catch {
    showToast(i18n.t('toast.backend'), true)
  }
}
</script>

<template>
  <main class="page fade-in">
    <section class="hero">
      <p class="eyebrow">{{ i18n.t('list.eyebrow') }}</p>
      <h1 class="display">
        {{ i18n.t('list.title.1') }}
        <span class="accent">{{ i18n.t('list.title.2') }}</span><span class="outline">.</span>
      </h1>
    </section>

    <!-- Filter -->
    <div class="filter-bar" role="group" aria-label="Filter">
      <button
        v-for="f in FILTERS"
        :key="f"
        class="filter-btn"
        :class="{ active: activeFilter === f }"
        @click="activeFilter = f"
      >
        {{ filterLabel(f) }}
      </button>
    </div>

    <!-- Zustände -->
    <div v-if="loading" class="state-msg">
      <span class="cursor">{{ i18n.t('list.loading') }}</span>
    </div>

    <div v-else-if="store.books.length === 0" class="state-msg">
      <span class="big">{{ i18n.t('list.empty.big') }}</span>
      {{ i18n.t('list.empty.text') }}
    </div>

    <div v-else-if="filteredBooks.length === 0" class="state-msg">
      <span class="big">{{ i18n.t('list.nomatch.big') }}</span>
      {{ i18n.t('list.nomatch.text') }}
    </div>

    <!-- Liste -->
    <div v-else class="results-grid fade-in">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        context="list"
        :title="book.title"
        :authors="book.author"
        :thumbnail="book.thumbnail"
        :description="book.description ?? undefined"
        :reading-status="book.readingStatus"
        @status-change="(s) => handleStatusChange(book, s)"
        @delete="handleDelete(book)"
      />
    </div>
  </main>
</template>

<style scoped>
.hero {
  margin-bottom: 36px;
}

.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}

.filter-btn {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.5px;
  padding: 8px 16px;
  border: var(--border-thin);
  background: var(--paper-raised);
  color: var(--gray-deep);
  transition: background var(--transition), color var(--transition), box-shadow var(--transition);
}

.filter-btn:hover {
  background: var(--stamp-yellow);
  color: var(--ink);
}

.filter-btn.active {
  background: var(--ink);
  color: var(--paper);
  box-shadow: var(--shadow-sm);
}
</style>
