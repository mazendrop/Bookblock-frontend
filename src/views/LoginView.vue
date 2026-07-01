<script setup lang="ts">
import { oktaAuth } from '../okta'

// Leitet zur Okta-Login-/Registrierungsseite weiter (Authorization Code + PKCE).
// Nach erfolgreichem Login kommt Okta zu /login/callback zurueck.
async function login() {
  await oktaAuth.signInWithRedirect()
}
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <p class="login-eyebrow">// BOOKBLOCK — ANMELDUNG</p>
      <h1 class="login-title">MELDE DICH<br />AN.</h1>
      <p class="login-sub">
        Log dich ein oder registriere dich, um deine persönliche Leseliste zu sehen.
      </p>
      <button class="login-btn" @click="login">ANMELDEN / REGISTRIEREN ▸</button>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 24px;
  display: flex;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 520px;
}

.login-eyebrow {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 1px;
  color: var(--accent);
  margin-bottom: 12px;
}

.login-title {
  font-family: var(--font-display);
  font-size: clamp(2.4rem, 7vw, 3.6rem);
  line-height: 0.95;
  color: var(--ink);
  margin-bottom: 14px;
}

.login-sub {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--gray-deep);
  margin-bottom: 28px;
}

.login-btn {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 16px 28px;
  background: var(--accent);
  color: var(--paper);
  border: var(--border);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform var(--transition), background var(--transition);
}

.login-btn:hover {
  background: var(--accent-press);
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--ink);
}

.login-btn:active {
  transform: translate(0, 0);
  box-shadow: var(--shadow-sm);
}
</style>
