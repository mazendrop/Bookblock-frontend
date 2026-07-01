<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BookCard from '../components/BookCard.vue'
import { searchGoogleBooks, saveBook, PAGE_SIZE, type SearchResult } from '../lib/api'
import { store, showToast } from '../lib/store'
import { i18n } from '../lib/i18n'

const MAX_PAGES = 10 // Google wird bei tiefen Seiten unzuverlässig

const query = ref('')
const results = ref<SearchResult[]>([])
const state = ref<'initial' | 'loading' | 'results' | 'empty' | 'error'>('initial')
const errorMessage = ref('')
const currentPage = ref(1)
const totalItems = ref(0)

const totalPages = computed(() =>
  Math.min(Math.ceil(totalItems.value / PAGE_SIZE), MAX_PAGES),
)

const visiblePages = computed(() => {
  const pages: number[] = []
  const start = Math.max(1, Math.min(currentPage.value - 2, totalPages.value - 4))
  const end = Math.min(totalPages.value, start + 4)
  for (let p = start; p <= end; p++) pages.push(p)
  return pages
})

onMounted(() => {
  if (!store.loaded) store.load().catch(() => showToast(i18n.t('toast.backend'), true))
})

async function performSearch(page = 1) {
  const q = query.value.trim()
  if (!q) return

  state.value = 'loading'
  currentPage.value = page
  try {
    const data = await searchGoogleBooks(q, page)
    results.value = data.results
    totalItems.value = data.totalItems
    state.value = data.results.length ? 'results' : 'empty'
    window.scrollTo({ top: 0 })
  } catch (e: any) {
    errorMessage.value = e.message || 'Something went wrong. Please try again.'
    state.value = 'error'
  }
}

async function handleSave(book: SearchResult) {
  try {
    const entry = await saveBook({
      title: book.title,
      author: book.authors,
      readingStatus: 'WANT_TO_READ',
      thumbnail: book.thumbnail,
      description: book.description.slice(0, 9000),
    })
    store.books.push(entry)
    showToast(`"${book.title}" ${i18n.t('toast.added')}`)
  } catch {
    showToast(i18n.t('toast.saveFailed'), true)
  }
}
</script>

<template>
  <main class="page fade-in">
    <!-- Hero -->
    <section class="hero">
      <p class="eyebrow">{{ i18n.t('home.eyebrow', { n: store.books.length }) }}</p>
      <h1 class="display">
        {{ i18n.t('home.title.1') }}<br />
        <span class="outline">{{ i18n.t('home.title.2') }}</span>
        <span class="accent"> {{ i18n.t('home.title.3') }}</span>
      </h1>
    </section>

    <!-- Suchleiste -->
    <form class="search-bar" @submit.prevent="performSearch(1)">
      <input
        v-model="query"
        type="text"
        class="search-input"
        :placeholder="i18n.t('home.placeholder')"
        autocomplete="off"
        :aria-label="i18n.t('home.placeholder')"
      />
      <button type="submit" class="search-btn">{{ i18n.t('home.searchBtn') }}</button>
    </form>

    <!-- Zustände -->
    <div v-if="state === 'initial'" class="state-msg">
      <span class="big">{{ i18n.t('home.initial.big') }}</span>
      {{ i18n.t('home.initial.text') }}
    </div>

    <div v-else-if="state === 'loading'" class="state-msg">
      <span class="cursor">{{ i18n.t('home.loading') }}</span>
    </div>

    <div v-else-if="state === 'empty'" class="state-msg">
      <span class="big">{{ i18n.t('home.empty.big') }}</span>
      {{ i18n.t('home.empty.text') }}
    </div>

    <div v-else-if="state === 'error'" class="state-msg error">
      <span class="big">{{ i18n.t('home.error.big') }}</span>
      {{ errorMessage }}
    </div>

    <!-- Ergebnisse -->
    <template v-else>
      <div class="results-grid fade-in">
        <BookCard
          v-for="book in results"
          :key="book.googleId"
          context="search"
          :title="book.title"
          :authors="book.authors"
          :thumbnail="book.thumbnail"
          :description="book.description"
          :published-date="book.publishedDate"
          :average-rating="book.averageRating"
          :saved="store.isSaved(book.title, book.authors)"
          @save="handleSave(book)"
        />
      </div>

      <!-- Pagination -->
      <nav v-if="totalPages > 1" class="pagination" aria-label="Pagination">
        <button
          class="page-btn arrow"
          :disabled="currentPage === 1"
          @click="performSearch(currentPage - 1)"
        >◀</button>

        <button
          v-for="p in visiblePages"
          :key="p"
          class="page-btn"
          :class="{ active: p === currentPage }"
          @click="p !== currentPage && performSearch(p)"
        >{{ p }}</button>

        <button
          class="page-btn arrow"
          :disabled="currentPage === totalPages"
          @click="performSearch(currentPage + 1)"
        >▶</button>
      </nav>
    </template>
  </main>
</template>

<style scoped>
.hero {
  margin-bottom: 36px;
}

.search-bar {
  display: flex;
  margin-bottom: 36px;
  box-shadow: var(--shadow);
}

.search-input {
  flex: 1;
  font-size: 1rem;
  font-weight: 500;
  padding: 15px 18px;
  border: var(--border);
  border-right: none;
  background: var(--paper-raised);
  color: var(--ink);
  outline: none;
}

.search-input::placeholder {
  color: var(--gray-mid);
}

.search-input:focus {
  box-shadow: inset 0 -4px 0 var(--accent);
}

.search-btn {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 15px 32px;
  border: var(--border);
  background: var(--ink);
  color: var(--paper);
  transition: background var(--transition);
}

.search-btn:hover {
  background: var(--accent);
}

.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 40px;
  flex-wrap: wrap;
}

.page-btn {
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  min-width: 42px;
  padding: 9px 12px;
  border: var(--border-thin);
  background: var(--paper-raised);
  color: var(--ink);
  transition: background var(--transition), color var(--transition), box-shadow var(--transition);
}

.page-btn:hover:not([disabled]):not(.active) {
  background: var(--stamp-yellow);
}

.page-btn.active {
  background: var(--accent);
  color: var(--paper);
  box-shadow: var(--shadow-sm);
}

.page-btn[disabled] {
  opacity: 0.35;
  cursor: default;
}

@media (max-width: 640px) {
  .search-bar {
    flex-direction: column;
  }

  .search-input {
    border-right: var(--border);
    border-bottom: none;
  }
}
</style>
