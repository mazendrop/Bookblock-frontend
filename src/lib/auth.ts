// Eigener Auth-Store: Login/Registrierung gegen unser Backend.
// Das JWT wird in localStorage gespeichert, damit man nach einem Reload
// angemeldet bleibt.
import { reactive } from 'vue'
import { BASE_URL } from './config'

const TOKEN_KEY = 'bookblock_token'
const EMAIL_KEY = 'bookblock_email'

export const auth = reactive({
  token: localStorage.getItem(TOKEN_KEY) || '',
  email: localStorage.getItem(EMAIL_KEY) || '',

  get isAuthenticated(): boolean {
    return this.token.length > 0
  },

  async login(email: string, password: string) {
    await this.submit('/auth/login', email, password)
  },

  async register(email: string, password: string) {
    await this.submit('/auth/register', email, password)
  },

  /** Schickt die Daten ans Backend und speichert das zurueckgegebene Token. */
  async submit(path: string, email: string, password: string) {
    // Timeout, damit die Anfrage nie endlos haengt. 70s decken auch den
    // "Cold Start" des kostenlosen Render-Backends ab.
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 70_000)

    let res: Response
    try {
      res = await fetch(`${BASE_URL}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      })
    } catch {
      throw new Error(
        'Server nicht erreichbar. Der Gratis-Server schläft evtl. gerade — bitte in ~1 Minute nochmal versuchen.',
      )
    } finally {
      clearTimeout(timeout)
    }

    if (!res.ok) {
      throw new Error(errorMessage(res.status))
    }
    const data = await res.json()
    this.token = data.token
    this.email = data.email
    localStorage.setItem(TOKEN_KEY, this.token)
    localStorage.setItem(EMAIL_KEY, this.email)
  },

  logout() {
    this.token = ''
    this.email = ''
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(EMAIL_KEY)
  },
})

function errorMessage(status: number): string {
  if (status === 401) return 'E-Mail oder Passwort ist falsch.'
  if (status === 409) return 'Diese E-Mail ist bereits registriert.'
  if (status === 400) return 'Bitte gültige E-Mail und Passwort (min. 8 Zeichen) eingeben.'
  return 'Etwas ist schiefgelaufen. Bitte später erneut versuchen.'
}
