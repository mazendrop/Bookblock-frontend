// Kleiner reaktiver Auth-Zustand rund um okta-auth-js.
// So kann jede Komponente einfach auf `auth.isAuthenticated` / `auth.email`
// zugreifen, ohne Okta-Details zu kennen.
import { reactive } from 'vue'
import { oktaAuth } from '../okta'

export const auth = reactive({
  isAuthenticated: false,
  email: '',
  name: '',

  /** Liest den aktuellen Login-Status und die Nutzerdaten aus Okta. */
  async refresh() {
    this.isAuthenticated = await oktaAuth.isAuthenticated()
    if (this.isAuthenticated) {
      const user = await oktaAuth.getUser()
      this.email = user.email ?? ''
      this.name = user.name ?? user.email ?? ''
    } else {
      this.email = ''
      this.name = ''
    }
  },

  /** Meldet den Nutzer bei Okta ab und leitet zurueck zur App. */
  async logout() {
    await oktaAuth.signOut({ postLogoutRedirectUri: window.location.origin })
  },
})
