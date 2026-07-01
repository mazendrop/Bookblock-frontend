// Zentrale Okta-Konfiguration.
// Die Werte kommen aus Umgebungsvariablen (Vite) und liegen NICHT im Code:
//   VITE_OKTA_ISSUER    z. B. https://dev-12345.okta.com/oauth2/default
//   VITE_OKTA_CLIENT_ID die Client-ID der Okta-SPA-Integration
import { OktaAuth } from '@okta/okta-auth-js'

const issuer = import.meta.env.VITE_OKTA_ISSUER as string
const clientId = import.meta.env.VITE_OKTA_CLIENT_ID as string

// okta-auth-js: kuemmert sich um Tokens (Access-Token fuers Backend, ID-Token
// fuer die Nutzerdaten) und den PKCE-Redirect-Login.
export const oktaAuth = new OktaAuth({
  issuer,
  clientId,
  redirectUri: window.location.origin + '/login/callback',
  scopes: ['openid', 'profile', 'email'],
  pkce: true,
})
