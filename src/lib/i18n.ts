// Mini-i18n: zwei Sprachen, kein externes Package nötig

import { reactive } from 'vue'

export type Locale = 'en' | 'de'

const messages: Record<Locale, Record<string, string>> = {
  en: {
    'nav.search': 'SEARCH',
    'nav.list': 'MY LIST',
    'home.eyebrow': '// GOOGLE BOOKS CATALOG — {n} BOOKS SAVED',
    'home.title.1': 'FIND YOUR',
    'home.title.2': 'NEXT',
    'home.title.3': 'READ.',
    'home.placeholder': 'Search books by title...',
    'home.searchBtn': 'SEARCH',
    'home.initial.big': '⌕ START TYPING',
    'home.initial.text': 'Search the Google Books catalog and save what you find.',
    'home.loading': 'SEARCHING',
    'home.empty.big': 'NOTHING FOUND',
    'home.empty.text': 'Try a different keyword.',
    'home.error.big': 'ERROR',
    'card.save': '+ SAVE',
    'card.saved': 'SAVED ✓',
    'card.more': 'READ MORE ▸',
    'card.less': 'SHOW LESS ▴',
    'card.delete': 'DELETE',
    'list.eyebrow': '// SAVED IN POSTGRESQL — RENDER.COM',
    'list.title.1': 'MY',
    'list.title.2': 'LIST',
    'list.loading': 'LOADING',
    'list.empty.big': 'EMPTY SHELF',
    'list.empty.text': 'Your reading list is empty — search for books and save them here.',
    'list.nomatch.big': 'NO MATCHES',
    'list.nomatch.text': 'No books with this status.',
    'filter.ALL': 'ALL',
    'status.WANT_TO_READ': 'WANT TO READ',
    'status.READING': 'READING',
    'status.FINISHED': 'FINISHED',
    'toast.added': 'added to your list',
    'toast.removed': 'removed',
    'toast.status': 'Status updated',
    'toast.backend': 'Backend not reachable',
    'toast.saveFailed': 'Could not save book — backend not reachable',
  },
  de: {
    'nav.search': 'SUCHE',
    'nav.list': 'MEINE LISTE',
    'home.eyebrow': '// GOOGLE BOOKS KATALOG — {n} BÜCHER GESPEICHERT',
    'home.title.1': 'FINDE DEIN',
    'home.title.2': 'NÄCHSTES',
    'home.title.3': 'BUCH.',
    'home.placeholder': 'Bücher nach Titel suchen...',
    'home.searchBtn': 'SUCHEN',
    'home.initial.big': '⌕ TIPP LOS',
    'home.initial.text': 'Durchsuche den Google-Books-Katalog und speichere deine Funde.',
    'home.loading': 'SUCHE LÄUFT',
    'home.empty.big': 'NICHTS GEFUNDEN',
    'home.empty.text': 'Versuch ein anderes Stichwort.',
    'home.error.big': 'FEHLER',
    'card.save': '+ SPEICHERN',
    'card.saved': 'GESPEICHERT ✓',
    'card.more': 'MEHR LESEN ▸',
    'card.less': 'WENIGER ▴',
    'card.delete': 'LÖSCHEN',
    'list.eyebrow': '// GESPEICHERT IN POSTGRESQL — RENDER.COM',
    'list.title.1': 'MEINE',
    'list.title.2': 'LISTE',
    'list.loading': 'LADEN',
    'list.empty.big': 'LEERES REGAL',
    'list.empty.text': 'Deine Leseliste ist leer — such Bücher und speichere sie hier.',
    'list.nomatch.big': 'KEINE TREFFER',
    'list.nomatch.text': 'Keine Bücher mit diesem Status.',
    'filter.ALL': 'ALLE',
    'status.WANT_TO_READ': 'WILL ICH LESEN',
    'status.READING': 'LESE ICH',
    'status.FINISHED': 'FERTIG GELESEN',
    'toast.added': 'zur Liste hinzugefügt',
    'toast.removed': 'entfernt',
    'toast.status': 'Status geändert',
    'toast.backend': 'Backend nicht erreichbar',
    'toast.saveFailed': 'Speichern fehlgeschlagen — Backend nicht erreichbar',
  },
}

const saved = localStorage.getItem('bookblock_locale')

export const i18n = reactive({
  locale: (saved === 'de' || saved === 'en' ? saved : 'en') as Locale,

  t(key: string, vars?: Record<string, string | number>): string {
    let s = messages[this.locale][key] ?? key
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        s = s.replace(`{${k}}`, String(v))
      }
    }
    return s
  },

  setLocale(l: Locale) {
    this.locale = l
    localStorage.setItem('bookblock_locale', l)
    document.documentElement.lang = l
  },
})
