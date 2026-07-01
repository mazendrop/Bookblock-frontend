<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore - das Widget bringt keine perfekten Vue-Typen mit
import OktaSignIn from '@okta/okta-signin-widget'
import '@okta/okta-signin-widget/css/okta-sign-in.min.css'
import { oktaSignInConfig } from '../okta'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let widget: any = null

onMounted(() => {
  widget = new OktaSignIn(oktaSignInConfig)
  // Zeigt die Login-/Register-Maske und leitet nach Erfolg zu /login/callback
  widget.showSignInAndRedirect({ el: '#okta-signin-container' }).catch((err: unknown) => {
    console.error('Okta Sign-In-Widget Fehler:', err)
  })
})

onBeforeUnmount(() => {
  // Widget aufraeumen, wenn die Seite verlassen wird
  widget?.remove()
})
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <p class="login-eyebrow">// BOOKBLOCK — ANMELDUNG</p>
      <h1 class="login-title">MELDE DICH<br />AN.</h1>
      <p class="login-sub">Log dich ein oder registriere dich, um deine persönliche Leseliste zu sehen.</p>
      <div id="okta-signin-container"></div>
    </div>
  </main>
</template>

<style>
/* Seite */
.login-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 48px 24px;
  display: flex;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 460px;
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
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 0.95;
  color: var(--ink);
  margin-bottom: 12px;
}

.login-sub {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--gray-deep);
  margin-bottom: 24px;
}

/* --- Okta-Widget an das Brutalist-Design anpassen --- */
#okta-signin-container .okta-sign-in-header,
#okta-signin-container .auth-header {
  border: none;
}

#okta-signin-container #okta-sign-in.auth-container {
  margin: 0;
  border: var(--border);
  border-radius: 0;
  box-shadow: var(--shadow);
  background: var(--paper-raised);
  font-family: var(--font-mono);
}

#okta-signin-container #okta-sign-in.auth-container .okta-form-title {
  font-family: var(--font-display);
  color: var(--ink);
}

#okta-signin-container #okta-sign-in.auth-container input[type='text'],
#okta-signin-container #okta-sign-in.auth-container input[type='password'] {
  border: var(--border-thin);
  border-radius: 0;
  font-family: var(--font-mono);
}

#okta-signin-container #okta-sign-in.auth-container .button-primary {
  background: var(--accent);
  border: var(--border-thin);
  border-radius: 0;
  box-shadow: var(--shadow-sm);
  color: var(--paper);
  font-family: var(--font-mono);
  font-weight: 700;
  letter-spacing: 1px;
  transition: transform var(--transition);
}

#okta-signin-container #okta-sign-in.auth-container .button-primary:hover {
  background: var(--accent-press);
  transform: translate(-1px, -1px);
}

#okta-signin-container #okta-sign-in.auth-container a {
  color: var(--accent);
}
</style>
