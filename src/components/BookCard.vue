<script setup lang="ts">
import { ref } from 'vue'
import { i18n } from '../lib/i18n'

const props = defineProps<{
  title: string
  authors: string
  thumbnail?: string | null
  description?: string
  publishedDate?: string
  averageRating?: number | null
  readingStatus?: string
  saved?: boolean
  context: 'search' | 'list'
}>()

const emit = defineEmits<{
  save: []
  'status-change': [status: string]
  delete: []
}>()

const STATUSES = ['WANT_TO_READ', 'READING', 'FINISHED']

const expanded = ref(false)
const needsExpand = (props.description?.length ?? 0) > 140
</script>

<template>
  <article class="book-card">
    <div class="book-thumb">
      <img v-if="thumbnail" :src="thumbnail" :alt="title" loading="lazy" />
      <div v-else class="placeholder">NO<br />COVER</div>
    </div>

    <div class="book-info">
      <span v-if="context === 'list' && readingStatus" class="chip" :class="readingStatus">
        {{ i18n.t(`status.${readingStatus}`) }}
      </span>

      <h3 class="book-title">{{ title }}</h3>
      <p class="book-authors">{{ authors }}</p>

      <p v-if="publishedDate || averageRating" class="book-meta">
        <span v-if="publishedDate">{{ publishedDate }}</span>
        <span v-if="averageRating">★ {{ averageRating }}</span>
      </p>

      <p v-if="description" class="book-desc" :class="{ expanded }">{{ description }}</p>
      <button v-if="needsExpand" class="btn-expand" @click="expanded = !expanded">
        {{ expanded ? i18n.t('card.less') : i18n.t('card.more') }}
      </button>

      <!-- Aktionen: Suche -->
      <div v-if="context === 'search'" class="card-actions">
        <button v-if="saved" class="btn ghost" disabled>{{ i18n.t('card.saved') }}</button>
        <button v-else class="btn" @click="emit('save')">{{ i18n.t('card.save') }}</button>
      </div>

      <!-- Aktionen: Leseliste -->
      <div v-else class="card-actions">
        <select
          class="status-select"
          :value="readingStatus"
          :aria-label="title"
          @change="emit('status-change', ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="s in STATUSES" :key="s" :value="s">{{ i18n.t(`status.${s}`) }}</option>
        </select>
        <button class="btn-delete" @click="emit('delete')">{{ i18n.t('card.delete') }}</button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.book-card {
  border: var(--border);
  background: var(--paper-raised);
  box-shadow: var(--shadow);
  display: flex;
  gap: 16px;
  padding: 16px;
  transition: transform var(--transition), box-shadow var(--transition);
}

.book-card:hover {
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--ink);
}

.book-thumb {
  flex-shrink: 0;
  width: 90px;
  height: 130px;
  border: var(--border-thin);
  background: var(--gray-line);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.book-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--gray-deep);
  text-align: center;
  line-height: 1.4;
}

.book-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.chip {
  margin-bottom: 8px;
}

.book-title {
  font-family: var(--font-mono);
  font-size: 0.92rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-authors {
  font-size: 0.8rem;
  color: var(--gray-deep);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

.book-meta {
  display: flex;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-mid);
  margin-bottom: 8px;
}

.book-desc {
  font-size: 0.78rem;
  color: var(--gray-deep);
  line-height: 1.5;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-desc.expanded {
  display: block;
  -webkit-line-clamp: unset;
}

.btn-expand {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: var(--accent);
  background: none;
  border: none;
  padding: 0;
  margin-bottom: 10px;
  letter-spacing: 0.3px;
}

.btn-expand:hover {
  color: var(--ink);
}

.card-actions {
  margin-top: auto;
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.status-select {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 6px 26px 6px 10px;
  border: var(--border-thin);
  background-color: var(--paper-raised);
  color: var(--ink);
  cursor: pointer;
  appearance: none;
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%230e0e0c'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 8px center;
}

.btn-delete {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  padding: 6px 12px;
  border: var(--border-thin);
  background: var(--paper-raised);
  color: var(--accent);
  transition: background var(--transition), color var(--transition);
}

.btn-delete:hover {
  background: var(--accent);
  color: var(--paper);
}
</style>
