<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { oktaAuth } from '../okta'

const router = useRouter()

onMounted(async () => {
  try {
    // Liest die Tokens aus der Okta-Weiterleitung und speichert sie
    await oktaAuth.handleLoginRedirect()
    await router.replace('/')
  } catch (err) {
    console.error('Login-Callback fehlgeschlagen:', err)
    await router.replace('/login')
  }
})
</script>

<template>
  <main class="callback-page">
    <p class="callback-text">ANMELDUNG LÄUFT …</p>
  </main>
</template>

<style scoped>
.callback-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 80px 24px;
  text-align: center;
}

.callback-text {
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--gray-deep);
}
</style>
