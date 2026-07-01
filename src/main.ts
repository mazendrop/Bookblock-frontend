import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { oktaAuth } from './okta'
import { auth } from './lib/auth'

const app = createApp(App)

app.use(router)

// Okta starten: erneuert Tokens automatisch und meldet Aenderungen am
// Login-Status. Bei jeder Aenderung aktualisieren wir unseren Auth-Store.
oktaAuth.start()
oktaAuth.authStateManager.subscribe(() => auth.refresh())
void auth.refresh()

app.mount('#app')
