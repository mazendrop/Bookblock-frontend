<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { store, toasts } from './lib/store'
import { i18n, type Locale } from './lib/i18n'
import { auth } from './lib/auth'

const LOCALES: Locale[] = ['en', 'de']
</script>

<template>
  <header class="site-header">
    <div class="header-inner">
      <RouterLink to="/" class="logo" aria-label="BookBlock">
        <svg class="logo-mark" viewBox="0 0 40 40" width="32" height="32" aria-hidden="true">
          <rect x="4" y="4" width="32" height="32" fill="#f2efe9" stroke="#0e0e0c" stroke-width="3" />
          <rect x="4" y="4" width="9" height="32" fill="#ff3d00" stroke="#0e0e0c" stroke-width="3" />
          <line x1="17" y1="13" x2="31" y2="13" stroke="#0e0e0c" stroke-width="3" />
          <line x1="17" y1="20" x2="31" y2="20" stroke="#0e0e0c" stroke-width="3" />
          <line x1="17" y1="27" x2="26" y2="27" stroke="#0e0e0c" stroke-width="3" />
        </svg>
        <span class="logo-word">BOOK<span class="logo-accent">BLOCK</span></span>
      </RouterLink>

      <div class="header-right">
        <nav v-if="auth.isAuthenticated" class="main-nav">
          <RouterLink to="/" class="nav-link">{{ i18n.t('nav.search') }}</RouterLink>
          <RouterLink to="/list" class="nav-link">
            {{ i18n.t('nav.list') }}
            <span class="badge">{{ store.books.length }}</span>
          </RouterLink>
        </nav>

        <div class="lang-switch" role="group" aria-label="Language">
          <button
            v-for="l in LOCALES"
            :key="l"
            class="lang-btn"
            :class="{ active: i18n.locale === l }"
            @click="i18n.setLocale(l)"
          >
            {{ l.toUpperCase() }}
          </button>
        </div>

        <div v-if="auth.isAuthenticated" class="user-box">
          <span class="user-email" :title="auth.email">{{ auth.email }}</span>
          <button class="logout-btn" @click="auth.logout()">{{ i18n.t('nav.logout') }}</button>
        </div>
      </div>
    </div>
  </header>

  <RouterView />

  <footer class="site-footer">
    <span>BOOKBLOCK — HTW BERLIN WEBTECH 2026</span>
    <span>POWERED BY GOOGLE BOOKS + SPRING BOOT</span>
  </footer>

  <!-- Toasts -->
  <div class="toast-container" aria-live="polite">
    <div v-for="toast in toasts" :key="toast.id" class="toast" :class="{ 'toast-error': toast.error }">
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--ink);
  color: var(--paper);
  border-bottom: 4px solid var(--accent);
}

.header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-size: 1.35rem;
  letter-spacing: 1px;
  color: var(--paper);
  text-decoration: none;
  user-select: none;
}

.logo-mark {
  display: block;
  width: 32px;
  height: 32px;
  flex: none;
}

.logo-word {
  line-height: 1;
}

.logo-accent {
  color: var(--accent);
}

.main-nav {
  display: flex;
  gap: 6px;
}

.nav-link {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 9px 18px;
  color: var(--gray-mid);
  text-decoration: none;
  border: 2px solid transparent;
  transition: color var(--transition), border-color var(--transition), background var(--transition);
}

.nav-link:hover {
  color: var(--paper);
}

.nav-link.router-link-exact-active {
  color: var(--paper);
  border-color: var(--accent);
  background: rgba(255, 61, 0, 0.12);
}

.badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  margin-left: 6px;
  font-size: 0.68rem;
  background: var(--accent);
  color: var(--paper);
}

.lang-switch {
  display: flex;
  border: 2px solid var(--gray-mid);
}

.lang-btn {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 6px 10px;
  background: transparent;
  color: var(--gray-mid);
  border: none;
  transition: background var(--transition), color var(--transition);
}

.lang-btn:hover {
  color: var(--paper);
}

.lang-btn.active {
  background: var(--paper);
  color: var(--ink);
}

.user-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-email {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  color: var(--gray-mid);
  max-width: 160px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.logout-btn {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 7px 12px;
  background: transparent;
  color: var(--paper);
  border: 2px solid var(--accent);
  cursor: pointer;
  transition: background var(--transition), color var(--transition);
}

.logout-btn:hover {
  background: var(--accent);
  color: var(--paper);
}

.site-footer {
  border-top: var(--border);
  background: var(--ink);
  color: var(--gray-mid);
  font-family: var(--font-mono);
  font-size: 0.65rem;
  letter-spacing: 1px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding: 14px 24px;
}

.toast-container {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  padding: 12px 20px;
  border: var(--border-thin);
  background: var(--ink);
  color: var(--paper);
  box-shadow: var(--shadow);
  max-width: 320px;
  animation: slideIn 200ms ease;
}

.toast-error {
  background: var(--accent);
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(40px); }
  to { opacity: 1; transform: translateX(0); }
}

@media (max-width: 640px) {
  .header-inner {
    height: auto;
    flex-direction: column;
    gap: 8px;
    padding: 12px 16px;
  }

  .header-right {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
