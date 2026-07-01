import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { oktaAuth } from '../okta'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'search',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/list',
      name: 'list',
      component: () => import('../views/ListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      // Login-Maske (Okta Sign-In-Widget)
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      // Okta leitet nach erfolgreichem Login hierher zurueck
      path: '/login/callback',
      name: 'callback',
      component: () => import('../views/LoginCallback.vue'),
    },
  ],
})

// Navigation-Guard: geschuetzte Seiten nur mit gueltigem Login.
// Wer nicht angemeldet ist, landet auf /login.
router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const loggedIn = await oktaAuth.isAuthenticated()
    if (!loggedIn) {
      return { path: '/login' }
    }
  }
})

export default router
