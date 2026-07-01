// Zentrale Konfiguration. In Produktion kommt die Backend-URL aus der
// Umgebungsvariable VITE_BACKEND_URL, lokal faellt sie auf localhost zurueck.
export const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080'
