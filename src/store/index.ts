// ============================================================
//   src/store/index.ts — FIXED VERSION
//   Fixed redux-persist storage for Next.js SSR
// ============================================================

import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH, REHYDRATE, PAUSE,
  PERSIST, PURGE, REGISTER,
} from 'redux-persist'

// ── FIXED: Use createWebStorage to avoid SSR errors ──────────────────────────
import createWebStorage from 'redux-persist/lib/storage/createWebStorage'

// Creates a noop storage for SSR, real localStorage for browser
function createNoopStorage() {
  return {
    getItem(_key: string)             { return Promise.resolve(null) },
    setItem(_key: string, value: any) { return Promise.resolve(value) },
    removeItem(_key: string)          { return Promise.resolve() },
  }
}

const storage =
  typeof window !== 'undefined'
    ? createWebStorage('local')
    : createNoopStorage()

// ─────────────────────────────────────────────────────────────────────────────

import preferencesReducer from '@/store/preferencesSlice'
import favoritesReducer   from '@/store/favoritesSlice'
import feedReducer        from '@/store/feedSlice'
import { contentApi }     from '@/store/contentApi'
import { STORAGE_KEYS }   from '@/lib/constants'


// ─── Persist Configs ──────────────────────────────────────────────────────────

const preferencesPersistConfig = {
  key:       STORAGE_KEYS.preferences,
  storage,
  whitelist: ['categories', 'darkMode', 'language', 'itemsPerPage', 'layout'],
}

const favoritesPersistConfig = {
  key:       STORAGE_KEYS.favorites,
  storage,
  whitelist: ['ids'],
}

const feedPersistConfig = {
  key:       STORAGE_KEYS.feedOrder,
  storage,
  whitelist: ['orderedIds'],
}


// ─── Root Reducer ─────────────────────────────────────────────────────────────

const rootReducer = combineReducers({
  preferences: persistReducer(preferencesPersistConfig, preferencesReducer),
  favorites:   persistReducer(favoritesPersistConfig,   favoritesReducer),
  feed:        persistReducer(feedPersistConfig,        feedReducer),
  [contentApi.reducerPath]: contentApi.reducer,
})


// ─── Store ────────────────────────────────────────────────────────────────────

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(contentApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
})


// ─── Persistor ───────────────────────────────────────────────────────────────

export const persistor = persistStore(store)


// ─── Types ────────────────────────────────────────────────────────────────────

export type RootState  = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


// ─── Typed Hooks ─────────────────────────────────────────────────────────────

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'

export const useAppDispatch: () => AppDispatch                = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector