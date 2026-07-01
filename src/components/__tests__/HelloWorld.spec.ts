import { describe, it, expect } from 'vitest'

import { i18n } from '../../lib/i18n'

// Prueft die kleine eigene Uebersetzungs-Schicht (Deutsch/Englisch).
describe('i18n Uebersetzungen', () => {
  it('wechselt zwischen Deutsch und Englisch', () => {
    i18n.setLocale('de')
    expect(i18n.t('nav.list')).toBe('MEINE LISTE')

    i18n.setLocale('en')
    expect(i18n.t('nav.list')).toBe('MY LIST')
  })

  it('faellt bei unbekanntem Schluessel auf den Schluessel selbst zurueck', () => {
    expect(i18n.t('gibt.es.nicht')).toBe('gibt.es.nicht')
  })
})
