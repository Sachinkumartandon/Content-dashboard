// ============================================================
//   src/store/preferencesSlice.ts
//   Redux slice for user preferences
//   Manages: categories, dark mode, language, layout, itemsPerPage
//   Persisted to localStorage via Redux Persist
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { PreferencesState, Category } from '@/types'
import {
  DEFAULT_CATEGORIES,
  DEFAULT_LANGUAGE,
  DEFAULT_ITEMS_PER_PAGE,
} from '@/lib/constants'


// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: PreferencesState = {
  categories:   DEFAULT_CATEGORIES,  // ['technology', 'entertainment', 'general']
  darkMode:     false,               // light mode by default
  language:     DEFAULT_LANGUAGE,    // 'en'
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE, // 10
  layout:       'grid',              // 'grid' | 'list'
}


// ─── Slice ────────────────────────────────────────────────────────────────────

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {

    // ── Toggle a category on/off ──────────────────────────────────────────
    // If category exists → remove it
    // If category doesn't exist → add it
    toggleCategory: (state, action: PayloadAction<Category>) => {
      const category = action.payload
      const index    = state.categories.indexOf(category)

      if (index !== -1) {
        // Already selected — remove it
        // But keep at least 1 category selected always
        if (state.categories.length > 1) {
          state.categories.splice(index, 1)
        }
      } else {
        // Not selected — add it
        state.categories.push(category)
      }
    },

    // ── Set all categories at once ────────────────────────────────────────
    setCategories: (state, action: PayloadAction<Category[]>) => {
      if (action.payload.length > 0) {
        state.categories = action.payload
      }
    },

    // ── Toggle dark mode on/off ───────────────────────────────────────────
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode

      // Apply dark mode to <html> element immediately
      if (typeof document !== 'undefined') {
        if (state.darkMode) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    },

    // ── Set dark mode explicitly ──────────────────────────────────────────
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload

      if (typeof document !== 'undefined') {
        if (action.payload) {
          document.documentElement.setAttribute('data-theme', 'dark')
        } else {
          document.documentElement.removeAttribute('data-theme')
        }
      }
    },

    // ── Set language ──────────────────────────────────────────────────────
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },

    // ── Set items per page ────────────────────────────────────────────────
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      const validOptions = [10, 20, 30]
      if (validOptions.includes(action.payload)) {
        state.itemsPerPage = action.payload
      }
    },

    // ── Set layout style ──────────────────────────────────────────────────
    setLayout: (state, action: PayloadAction<'grid' | 'list'>) => {
      state.layout = action.payload
    },

    // ── Reset all preferences to defaults ────────────────────────────────
    resetPreferences: () => initialState,
  },
})


// ─── Export Actions ───────────────────────────────────────────────────────────

export const {
  toggleCategory,
  setCategories,
  toggleDarkMode,
  setDarkMode,
  setLanguage,
  setItemsPerPage,
  setLayout,
  resetPreferences,
} = preferencesSlice.actions


// ─── Export Selectors ─────────────────────────────────────────────────────────
// Selectors let components read state cleanly
// Usage: const darkMode = useAppSelector(selectDarkMode)

export const selectCategories   = (state: { preferences: PreferencesState }) =>
  state.preferences.categories

export const selectDarkMode     = (state: { preferences: PreferencesState }) =>
  state.preferences.darkMode

export const selectLanguage     = (state: { preferences: PreferencesState }) =>
  state.preferences.language

export const selectItemsPerPage = (state: { preferences: PreferencesState }) =>
  state.preferences.itemsPerPage

export const selectLayout       = (state: { preferences: PreferencesState }) =>
  state.preferences.layout

export const selectPreferences  = (state: { preferences: PreferencesState }) =>
  state.preferences


// ─── Export Reducer ───────────────────────────────────────────────────────────

export default preferencesSlice.reducer