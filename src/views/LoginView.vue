<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../lib/auth'
import { store } from '../lib/store'

const router = useRouter()

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

async function submit() {
  error.value = ''
  busy.value = true
  try {
    if (mode.value === 'login') {
      await auth.login(email.value, password.value)
    } else {
      await auth.register(email.value, password.value)
    }
    // Alte Liste (evtl. vom vorherigen Nutzer) leeren -> wird fuer den neuen
    // Nutzer frisch geladen.
    store.reset()
    await router.replace('/')
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Fehler bei der Anmeldung.'
  } finally {
    busy.value = false
  }
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  error.value = ''
}
</script>

<template>
  <main class="login-page">
    <div class="login-card">
      <p class="login-eyebrow">// BOOKBLOCK — {{ mode === 'login' ? 'ANMELDUNG' : 'REGISTRIERUNG' }}</p>
      <h1 class="login-title">
        {{ mode === 'login' ? 'MELDE DICH' : 'LEG LOS' }}<br />{{ mode === 'login' ? 'AN.' : 'MIT UNS.' }}
      </h1>
      <p class="login-sub">
        {{
          mode === 'login'
            ? 'Melde dich an, um deine persönliche Leseliste zu sehen.'
            : 'Erstelle ein Konto und starte deine persönliche Leseliste.'
        }}
      </p>

      <form class="login-form" @submit.prevent="submit">
        <label class="field">
          <span class="field-label">E-MAIL</span>
          <input v-model="email" type="email" autocomplete="email" required placeholder="du@beispiel.de" />
        </label>

        <label class="field">
          <span class="field-label">PASSWORT</span>
          <input
            v-model="password"
            type="password"
            :autocomplete="mode === 'login' ? 'current-password' : 'new-password'"
            required
            minlength="8"
            placeholder="mindestens 8 Zeichen"
          />
        </label>

        <p v-if="error" class="login-error">{{ error }}</p>

        <button class="login-btn" type="submit" :disabled="busy">
          {{ busy ? 'BITTE WARTEN …' : mode === 'login' ? 'ANMELDEN ▸' : 'REGISTRIEREN ▸' }}
        </button>
      </form>

      <button class="switch-btn" type="button" @click="toggleMode">
        {{ mode === 'login' ? 'Noch kein Konto? Jetzt registrieren' : 'Schon ein Konto? Zum Login' }}
      </button>
    </div>
  </main>
</template>

<style scoped>
.login-page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 56px 24px;
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
  margin-bottom: 28px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 1px;
  color: var(--ink);
}

.field input {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  padding: 12px 14px;
  background: var(--paper-raised);
  border: var(--border-thin);
  border-radius: 0;
  color: var(--ink);
}

.field input:focus {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}

.login-error {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--paper);
  background: var(--accent);
  border: var(--border-thin);
  padding: 10px 12px;
}

.login-btn {
  font-family: var(--font-mono);
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 1px;
  padding: 15px 24px;
  margin-top: 4px;
  background: var(--accent);
  color: var(--paper);
  border: var(--border);
  box-shadow: var(--shadow);
  cursor: pointer;
  transition: transform var(--transition), background var(--transition);
}

.login-btn:hover:not(:disabled) {
  background: var(--accent-press);
  transform: translate(-2px, -2px);
  box-shadow: 7px 7px 0 var(--ink);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.switch-btn {
  margin-top: 20px;
  background: none;
  border: none;
  padding: 0;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--gray-deep);
  text-decoration: underline;
  cursor: pointer;
}

.switch-btn:hover {
  color: var(--accent);
}
</style>
