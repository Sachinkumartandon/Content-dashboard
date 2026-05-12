// ============================================================
//   src/lib/constants.ts
//   All app-wide constant values in one place
//   Import anywhere: import { CATEGORIES } from '@/lib/constants'
// ============================================================

import type { Category } from '@/types'


// ─── App Info ─────────────────────────────────────────────────────────────────

export const APP_NAME    = 'ContentDash'
export const APP_VERSION = '1.0.0'
export const APP_URL     = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'


// ─── Content Categories ───────────────────────────────────────────────────────

export const CATEGORIES: {
  value: Category
  label: string
  emoji: string
}[] = [
  { value: 'technology',     label: 'Technology',     emoji: '💻' },
  { value: 'sports',         label: 'Sports',         emoji: '⚽' },
  { value: 'finance',        label: 'Finance',        emoji: '💰' },
  { value: 'entertainment',  label: 'Entertainment',  emoji: '🎬' },
  { value: 'health',         label: 'Health',         emoji: '🏥' },
  { value: 'science',        label: 'Science',        emoji: '🔬' },
  { value: 'business',       label: 'Business',       emoji: '💼' },
  { value: 'general',        label: 'General',        emoji: '📰' },
]

// Default categories selected when user first opens the app
export const DEFAULT_CATEGORIES: Category[] = [
  'technology',
  'entertainment',
  'general',
]


// ─── Pagination ───────────────────────────────────────────────────────────────

export const DEFAULT_ITEMS_PER_PAGE = 10
export const ITEMS_PER_PAGE_OPTIONS = [10, 20, 30]
export const MAX_PAGES              = 5   // max pages to fetch from API


// ─── Search ───────────────────────────────────────────────────────────────────

export const SEARCH_DEBOUNCE_MS  = 300   // wait 300ms after user stops typing
export const SEARCH_MIN_LENGTH   = 2     // minimum characters to trigger search
export const MAX_SEARCH_RESULTS  = 8     // max results shown in dropdown


// ─── API Config ───────────────────────────────────────────────────────────────

export const NEWS_API_BASE_URL  = process.env.NEWS_API_BASE_URL  || 'https://newsapi.org/v2'
export const TMDB_API_BASE_URL  = process.env.TMDB_API_BASE_URL  || 'https://api.themoviedb.org/3'
export const TMDB_IMAGE_BASE_URL = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p'

// TMDB image sizes
export const TMDB_IMAGE_SIZES = {
  small:    `${TMDB_IMAGE_BASE_URL}/w185`,
  medium:   `${TMDB_IMAGE_BASE_URL}/w342`,
  large:    `${TMDB_IMAGE_BASE_URL}/w500`,
  original: `${TMDB_IMAGE_BASE_URL}/original`,
}

// Cache time for RTK Query (in seconds)
export const CACHE_TIME = {
  news:            60 * 5,   // 5 minutes
  recommendations: 60 * 30,  // 30 minutes
  social:          60 * 2,   // 2 minutes
  trending:        60 * 10,  // 10 minutes
}


// ─── TMDB Genre Map ───────────────────────────────────────────────────────────
// Maps TMDB genre IDs to genre names

export const TMDB_GENRE_MAP: Record<number, string> = {
  28:    'Action',
  12:    'Adventure',
  16:    'Animation',
  35:    'Comedy',
  80:    'Crime',
  99:    'Documentary',
  18:    'Drama',
  10751: 'Family',
  14:    'Fantasy',
  36:    'History',
  27:    'Horror',
  10402: 'Music',
  9648:  'Mystery',
  10749: 'Romance',
  878:   'Science Fiction',
  10770: 'TV Movie',
  53:    'Thriller',
  10752: 'War',
  37:    'Western',
}


// ─── Languages ────────────────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',    flag: '🇺🇸' },
  { code: 'hi', label: 'Hindi',      flag: '🇮🇳' },
  { code: 'es', label: 'Spanish',    flag: '🇪🇸' },
  { code: 'fr', label: 'French',     flag: '🇫🇷' },
  { code: 'de', label: 'German',     flag: '🇩🇪' },
  { code: 'ja', label: 'Japanese',   flag: '🇯🇵' },
]

export const DEFAULT_LANGUAGE = 'en'


// ─── Local Storage Keys ───────────────────────────────────────────────────────
// Keys used to save data in localStorage via Redux Persist

export const STORAGE_KEYS = {
  preferences: 'contentdash_preferences',
  favorites:   'contentdash_favorites',
  feedOrder:   'contentdash_feed_order',
  theme:       'contentdash_theme',
}


// ─── Navigation Links ─────────────────────────────────────────────────────────

export const NAV_LINKS = [
  { href: '/',          label: 'Feed',      icon: 'home'     },
  { href: '/trending',  label: 'Trending',  icon: 'trending' },
  { href: '/favorites', label: 'Favorites', icon: 'heart'    },
  { href: '/settings',  label: 'Settings',  icon: 'settings' },
]


// ─── Drag and Drop ────────────────────────────────────────────────────────────

export const DND_ITEM_TYPE = 'CONTENT_CARD'


// ─── Fallback Images ──────────────────────────────────────────────────────────
// Used when an API returns no image

export const FALLBACK_IMAGES = {
  news:   'https://via.placeholder.com/400x200?text=News',
  movie:  'https://via.placeholder.com/400x600?text=Movie',
  social: 'https://via.placeholder.com/400x400?text=Post',
  avatar: 'https://via.placeholder.com/40x40?text=U',
}


// ─── Animation Durations (ms) ─────────────────────────────────────────────────

export const ANIMATION = {
  fast:   150,
  normal: 300,
  slow:   500,
}