// ============================================================
//   __tests__/unit/preferencesSlice.test.ts
//   Unit tests for preferencesSlice Redux reducer
//   Tests:
//   - Initial state
//   - toggleCategory (add/remove/guard)
//   - setCategories
//   - toggleDarkMode
//   - setDarkMode
//   - setLanguage
//   - setItemsPerPage
//   - setLayout
//   - resetPreferences
// ============================================================

import preferencesReducer, {
  toggleCategory,
  setCategories,
  toggleDarkMode,
  setDarkMode,
  setLanguage,
  setItemsPerPage,
  setLayout,
  resetPreferences,
  selectCategories,
  selectDarkMode,
  selectLanguage,
  selectItemsPerPage,
  selectLayout,
}                          from '@/store/preferencesSlice'
import type { PreferencesState } from '@/types'


// ─── Initial State ────────────────────────────────────────────────────────────

const defaultState: PreferencesState = {
  categories:   ['technology', 'entertainment', 'general'],
  darkMode:     false,
  language:     'en',
  itemsPerPage: 10,
  layout:       'grid',
}


// ─── Tests ────────────────────────────────────────────────────────────────────

describe('preferencesSlice', () => {

  // ── Initial State ──────────────────────────────────────────────────────

  describe('initial state', () => {
    it('has correct default categories', () => {
      const state = preferencesReducer(undefined, { type: '@@INIT' })
      expect(state.categories).toEqual(
        ['technology', 'entertainment', 'general']
      )
    })

    it('starts with dark mode off', () => {
      const state = preferencesReducer(undefined, { type: '@@INIT' })
      expect(state.darkMode).toBe(false)
    })

    it('starts with English language', () => {
      const state = preferencesReducer(undefined, { type: '@@INIT' })
      expect(state.language).toBe('en')
    })

    it('starts with 10 items per page', () => {
      const state = preferencesReducer(undefined, { type: '@@INIT' })
      expect(state.itemsPerPage).toBe(10)
    })

    it('starts with grid layout', () => {
      const state = preferencesReducer(undefined, { type: '@@INIT' })
      expect(state.layout).toBe('grid')
    })
  })


  // ── toggleCategory ─────────────────────────────────────────────────────

  describe('toggleCategory', () => {
    it('adds a new category when not selected', () => {
      const state = preferencesReducer(
        defaultState,
        toggleCategory('sports')
      )
      expect(state.categories).toContain('sports')
    })

    it('removes a category when already selected', () => {
      const state = preferencesReducer(
        defaultState,
        toggleCategory('technology')
      )
      expect(state.categories).not.toContain('technology')
    })

    it('does not remove last remaining category', () => {
      const singleCategory: PreferencesState = {
        ...defaultState,
        categories: ['technology'],
      }
      const state = preferencesReducer(
        singleCategory,
        toggleCategory('technology')
      )
      // Should still have technology — cannot remove last category
      expect(state.categories).toContain('technology')
      expect(state.categories).toHaveLength(1)
    })

    it('preserves other categories when adding new one', () => {
      const state = preferencesReducer(
        defaultState,
        toggleCategory('sports')
      )
      expect(state.categories).toContain('technology')
      expect(state.categories).toContain('entertainment')
      expect(state.categories).toContain('general')
      expect(state.categories).toContain('sports')
    })

    it('preserves other categories when removing one', () => {
      const state = preferencesReducer(
        defaultState,
        toggleCategory('technology')
      )
      expect(state.categories).toContain('entertainment')
      expect(state.categories).toContain('general')
    })

    it('can add multiple categories', () => {
      let state = preferencesReducer(defaultState, toggleCategory('sports'))
      state     = preferencesReducer(state,        toggleCategory('health'))
      state     = preferencesReducer(state,        toggleCategory('finance'))
      expect(state.categories).toContain('sports')
      expect(state.categories).toContain('health')
      expect(state.categories).toContain('finance')
    })
  })


  // ── setCategories ──────────────────────────────────────────────────────

  describe('setCategories', () => {
    it('replaces all categories at once', () => {
      const state = preferencesReducer(
        defaultState,
        setCategories(['sports', 'health'])
      )
      expect(state.categories).toEqual(['sports', 'health'])
    })

    it('does not set empty categories array', () => {
      const state = preferencesReducer(
        defaultState,
        setCategories([])
      )
      // Should keep existing categories
      expect(state.categories).toEqual(defaultState.categories)
    })
  })


  // ── toggleDarkMode ─────────────────────────────────────────────────────

  describe('toggleDarkMode', () => {
    it('turns dark mode on when it is off', () => {
      const state = preferencesReducer(
        { ...defaultState, darkMode: false },
        toggleDarkMode()
      )
      expect(state.darkMode).toBe(true)
    })

    it('turns dark mode off when it is on', () => {
      const state = preferencesReducer(
        { ...defaultState, darkMode: true },
        toggleDarkMode()
      )
      expect(state.darkMode).toBe(false)
    })

    it('toggles dark mode twice returns to original', () => {
      let state = preferencesReducer(defaultState, toggleDarkMode())
      state     = preferencesReducer(state,        toggleDarkMode())
      expect(state.darkMode).toBe(false)
    })
  })


  // ── setDarkMode ────────────────────────────────────────────────────────

  describe('setDarkMode', () => {
    it('sets dark mode to true', () => {
      const state = preferencesReducer(defaultState, setDarkMode(true))
      expect(state.darkMode).toBe(true)
    })

    it('sets dark mode to false', () => {
      const state = preferencesReducer(
        { ...defaultState, darkMode: true },
        setDarkMode(false)
      )
      expect(state.darkMode).toBe(false)
    })
  })


  // ── setLanguage ────────────────────────────────────────────────────────

  describe('setLanguage', () => {
    it('sets language to Hindi', () => {
      const state = preferencesReducer(defaultState, setLanguage('hi'))
      expect(state.language).toBe('hi')
    })

    it('sets language to Spanish', () => {
      const state = preferencesReducer(defaultState, setLanguage('es'))
      expect(state.language).toBe('es')
    })

    it('sets language back to English', () => {
      const hindiState = { ...defaultState, language: 'hi' }
      const state      = preferencesReducer(hindiState, setLanguage('en'))
      expect(state.language).toBe('en')
    })
  })


  // ── setItemsPerPage ────────────────────────────────────────────────────

  describe('setItemsPerPage', () => {
    it('sets items per page to 20', () => {
      const state = preferencesReducer(defaultState, setItemsPerPage(20))
      expect(state.itemsPerPage).toBe(20)
    })

    it('sets items per page to 30', () => {
      const state = preferencesReducer(defaultState, setItemsPerPage(30))
      expect(state.itemsPerPage).toBe(30)
    })

    it('ignores invalid items per page value', () => {
      const state = preferencesReducer(defaultState, setItemsPerPage(99))
      // Should keep existing value — 99 is not a valid option
      expect(state.itemsPerPage).toBe(10)
    })

    it('ignores zero as items per page', () => {
      const state = preferencesReducer(defaultState, setItemsPerPage(0))
      expect(state.itemsPerPage).toBe(10)
    })
  })


  // ── setLayout ──────────────────────────────────────────────────────────

  describe('setLayout', () => {
    it('sets layout to list', () => {
      const state = preferencesReducer(defaultState, setLayout('list'))
      expect(state.layout).toBe('list')
    })

    it('sets layout back to grid', () => {
      const listState = { ...defaultState, layout: 'list' as const }
      const state     = preferencesReducer(listState, setLayout('grid'))
      expect(state.layout).toBe('grid')
    })
  })


  // ── resetPreferences ───────────────────────────────────────────────────

  describe('resetPreferences', () => {
    it('resets all preferences to defaults', () => {
      const modifiedState: PreferencesState = {
        categories:   ['sports'],
        darkMode:     true,
        language:     'hi',
        itemsPerPage: 30,
        layout:       'list',
      }
      const state = preferencesReducer(modifiedState, resetPreferences())
      expect(state).toEqual(defaultState)
    })

    it('resets dark mode to false', () => {
      const state = preferencesReducer(
        { ...defaultState, darkMode: true },
        resetPreferences()
      )
      expect(state.darkMode).toBe(false)
    })

    it('resets categories to defaults', () => {
      const state = preferencesReducer(
        { ...defaultState, categories: ['sports'] },
        resetPreferences()
      )
      expect(state.categories).toEqual(
        ['technology', 'entertainment', 'general']
      )
    })
  })


  // ── Selectors ──────────────────────────────────────────────────────────

  describe('selectors', () => {
    const storeState = { preferences: defaultState }

    it('selectCategories returns categories array', () => {
      expect(selectCategories(storeState)).toEqual(
        ['technology', 'entertainment', 'general']
      )
    })

    it('selectDarkMode returns dark mode boolean', () => {
      expect(selectDarkMode(storeState)).toBe(false)
    })

    it('selectLanguage returns language string', () => {
      expect(selectLanguage(storeState)).toBe('en')
    })

    it('selectItemsPerPage returns items per page number', () => {
      expect(selectItemsPerPage(storeState)).toBe(10)
    })

    it('selectLayout returns layout string', () => {
      expect(selectLayout(storeState)).toBe('grid')
    })
  })
})