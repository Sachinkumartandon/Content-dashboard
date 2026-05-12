// ============================================================
//   src/store/feedSlice.ts
//   Redux slice for feed UI state
//   Manages: card order (drag-drop), search query,
//            active section, current page
// ============================================================

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { FeedState, SectionType } from '@/types'


// ─── Initial State ────────────────────────────────────────────────────────────

const initialState: FeedState = {
  orderedIds:    [],        // card IDs in drag-drop order
  currentPage:   1,         // current pagination page
  searchQuery:   '',        // current search query string
  activeSection: 'feed',    // currently active section
}


// ─── Slice ────────────────────────────────────────────────────────────────────

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {

    // ── Set ordered card IDs ──────────────────────────────────────────────
    // Called when feed loads for the first time
    setOrderedIds: (state, action: PayloadAction<string[]>) => {
      state.orderedIds = action.payload
    },

    // ── Reorder cards after drag and drop ─────────────────────────────────
    // Moves card from one index to another
    reorderCards: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload

      if (
        fromIndex < 0 ||
        toIndex   < 0 ||
        fromIndex >= state.orderedIds.length ||
        toIndex   >= state.orderedIds.length
      ) {
        return // invalid indices — do nothing
      }

      // Remove card from old position
      const [movedId] = state.orderedIds.splice(fromIndex, 1)

      // Insert card at new position
      state.orderedIds.splice(toIndex, 0, movedId)
    },

    // ── Set search query ──────────────────────────────────────────────────
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
      // Reset to page 1 when searching
      state.currentPage = 1
    },

    // ── Clear search query ────────────────────────────────────────────────
    clearSearchQuery: (state) => {
      state.searchQuery = ''
      state.currentPage = 1
    },

    // ── Set current page ──────────────────────────────────────────────────
    setCurrentPage: (state, action: PayloadAction<number>) => {
      if (action.payload >= 1) {
        state.currentPage = action.payload
      }
    },

    // ── Go to next page ───────────────────────────────────────────────────
    nextPage: (state) => {
      state.currentPage += 1
    },

    // ── Go to previous page ───────────────────────────────────────────────
    prevPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1
      }
    },

    // ── Set active section ────────────────────────────────────────────────
    // Controls which section is shown: feed, trending, favorites, settings
    setActiveSection: (state, action: PayloadAction<SectionType>) => {
      state.activeSection = action.payload
      // Reset page when switching sections
      state.currentPage   = 1
    },

    // ── Reset feed state ──────────────────────────────────────────────────
    resetFeed: (state) => {
      state.orderedIds  = []
      state.currentPage = 1
      state.searchQuery = ''
    },
  },
})


// ─── Export Actions ───────────────────────────────────────────────────────────

export const {
  setOrderedIds,
  reorderCards,
  setSearchQuery,
  clearSearchQuery,
  setCurrentPage,
  nextPage,
  prevPage,
  setActiveSection,
  resetFeed,
} = feedSlice.actions


// ─── Export Selectors ─────────────────────────────────────────────────────────

export const selectOrderedIds = (state: { feed: FeedState }) =>
  state.feed.orderedIds

export const selectCurrentPage = (state: { feed: FeedState }) =>
  state.feed.currentPage

export const selectSearchQuery = (state: { feed: FeedState }) =>
  state.feed.searchQuery

export const selectActiveSection = (state: { feed: FeedState }) =>
  state.feed.activeSection

export const selectIsSearching = (state: { feed: FeedState }) =>
  state.feed.searchQuery.trim().length > 0


// ─── Export Reducer ───────────────────────────────────────────────────────────

export default feedSlice.reducer