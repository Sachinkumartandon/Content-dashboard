// ============================================================
//   src/store/favoritesSlice.ts
//   Redux slice for user favorites
//   Manages: list of favorited content item IDs
//   Persisted to localStorage via Redux Persist
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FavoritesState }        from '@/types'


// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: FavoritesState = {
  ids: [], // array of favorited content item IDs
}


// ─── Slice ────────────────────────────────────────────────────────────────────

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {

    // ── Toggle favorite on/off ────────────────────────────────────────────
    // If ID exists → remove (unfavorite)
    // If ID doesn't exist → add (favorite)
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const id    = action.payload
      const index = state.ids.indexOf(id)

      if (index !== -1) {
        // Already favorited — remove it
        state.ids.splice(index, 1)
      } else {
        // Not favorited — add it
        state.ids.push(id)
      }
    },

    // ── Add to favorites ──────────────────────────────────────────────────
    addFavorite: (state, action: PayloadAction<string>) => {
      const id = action.payload
      if (!state.ids.includes(id)) {
        state.ids.push(id)
      }
    },

    // ── Remove from favorites ─────────────────────────────────────────────
    removeFavorite: (state, action: PayloadAction<string>) => {
      const id    = action.payload
      const index = state.ids.indexOf(id)
      if (index !== -1) {
        state.ids.splice(index, 1)
      }
    },

    // ── Clear all favorites ───────────────────────────────────────────────
    clearFavorites: (state) => {
      state.ids = []
    },
  },
})


// ─── Export Actions ───────────────────────────────────────────────────────────

export const {
  toggleFavorite,
  addFavorite,
  removeFavorite,
  clearFavorites,
} = favoritesSlice.actions


// ─── Export Selectors ─────────────────────────────────────────────────────────

// Get all favorite IDs
export const selectFavoriteIds = (state: { favorites: FavoritesState }) =>
  state.favorites.ids

// Check if a specific item is favorited
// Usage: const isFav = useAppSelector(state => selectIsFavorited(state, item.id))
export const selectIsFavorited = (
  state: { favorites: FavoritesState },
  id: string
) => state.favorites.ids.includes(id)

// Get total count of favorites
export const selectFavoritesCount = (state: { favorites: FavoritesState }) =>
  state.favorites.ids.length


// ─── Export Reducer ───────────────────────────────────────────────────────────

export default favoritesSlice.reducer