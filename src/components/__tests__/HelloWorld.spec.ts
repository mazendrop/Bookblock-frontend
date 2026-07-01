import { describe, it, expect } from 'vitest'

import { PAGE_SIZE, type SearchResult } from '../../lib/api'

// Der alte Vue-Scaffolding-Test importierte eine geloeschte HelloWorld.vue.
// Ersetzt durch einen leichten Sanity-Check der API-Schicht.
describe('api', () => {
  it('exposes a sensible page size', () => {
    expect(PAGE_SIZE).toBeGreaterThan(0)
  })

  it('SearchResult shape is usable', () => {
    const r: SearchResult = {
      googleId: 'x',
      title: 'Test',
      authors: 'Author',
      description: 'Desc',
      thumbnail: null,
      publishedDate: 'n/a',
      averageRating: null,
    }
    expect(r.title).toBe('Test')
  })
})
