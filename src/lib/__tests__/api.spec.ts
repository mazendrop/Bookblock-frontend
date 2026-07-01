import { describe, it, expect, vi } from 'vitest'

// Okta wird durch einen Mock ersetzt: getAccessToken liefert ein festes
// Test-Token. So testen wir die API-Schicht ohne echten Login.
vi.mock('../../okta', () => ({
  oktaAuth: {
    getAccessToken: () => 'test-token-123',
  },
}))

import { fetchBooks, searchGoogleBooks } from '../api'

describe('API-Schicht', () => {
  it('haengt das Okta-Token als Bearer an Backend-Anfragen an', async () => {
    // fetch faelschen, damit kein echtes Backend noetig ist
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => [] })
    vi.stubGlobal('fetch', fetchMock)

    await fetchBooks()

    const options = fetchMock.mock.calls[0]![1]
    expect(options.headers.Authorization).toBe('Bearer test-token-123')
  })

  it('sucht Buecher ueber das eigene Backend unter /search', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [], totalItems: 0 }),
    })
    vi.stubGlobal('fetch', fetchMock)

    await searchGoogleBooks('harry potter', 1)

    const url = fetchMock.mock.calls[0]![0] as string
    expect(url).toContain('/search?q=harry%20potter')
  })
})
