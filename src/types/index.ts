// ============================================================
//   src/types/index.ts
//   All shared TypeScript types and interfaces for the app
//   Import anywhere: import type { ContentItem } from '@/types'
// ============================================================


// ─── Content Types ────────────────────────────────────────────────────────────

// Every piece of content in the feed has one of these types
export type ContentType = 'news' | 'movie' | 'social'

// Categories the user can select in settings
export type Category =
  | 'technology'
  | 'sports'
  | 'finance'
  | 'entertainment'
  | 'health'
  | 'science'
  | 'business'
  | 'general'

// ─── News Article ─────────────────────────────────────────────────────────────

export interface NewsArticle {
  id:          string
  type:        'news'
  title:       string
  description: string
  content:     string
  url:         string
  imageUrl:    string | null
  source:      string
  author:      string | null
  category:    Category
  publishedAt: string
  isFavorite:  boolean
}

// ─── Movie Recommendation ─────────────────────────────────────────────────────

export interface Movie {
  id:          string
  type:        'movie'
  title:       string
  description: string
  imageUrl:    string | null
  rating:      number        // 0-10
  releaseDate: string
  genres:      string[]
  voteCount:   number
  popularity:  number
  isFavorite:  boolean
}

// ─── Social Media Post ────────────────────────────────────────────────────────

export interface SocialPost {
  id:          string
  type:        'social'
  content:     string
  imageUrl:    string | null
  author: {
    name:      string
    username:  string
    avatarUrl: string | null
  }
  hashtags:    string[]
  likes:       number
  comments:    number
  shares:      number
  platform:    'twitter' | 'instagram'
  publishedAt: string
  isFavorite:  boolean
}

// Union type — a content item can be any of the three above
export type ContentItem = NewsArticle | Movie | SocialPost

// ─── User Preferences ─────────────────────────────────────────────────────────

export interface UserPreferences {
  categories:   Category[]       // selected content categories
  darkMode:     boolean          // dark mode on/off
  language:     string           // e.g. 'en', 'hi', 'es'
  itemsPerPage: number           // 10 | 20 | 30
  layout:       'grid' | 'list' // feed layout style
}

// ─── Redux State Shapes ───────────────────────────────────────────────────────

export interface PreferencesState {
  categories:   Category[]
  darkMode:     boolean
  language:     string
  itemsPerPage: number
  layout:       'grid' | 'list'
}

export interface FavoritesState {
  ids: string[]   // array of favorited content item IDs
}

export interface FeedState {
  orderedIds:    string[]   // card order after drag-and-drop
  currentPage:   number
  searchQuery:   string
  activeSection: 'feed' | 'trending' | 'favorites' | 'settings'
}

// ─── API Response Shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data:       T
  status:     number
  message:    string
  totalCount: number
  page:       number
  totalPages: number
}

export interface NewsApiResponse {
  status:       string
  totalResults: number
  articles:     RawNewsArticle[]
}

export interface RawNewsArticle {
  source:      { id: string | null; name: string }
  author:      string | null
  title:       string
  description: string | null
  url:         string
  urlToImage:  string | null
  publishedAt: string
  content:     string | null
}

export interface TmdbResponse {
  page:          number
  results:       RawMovie[]
  total_pages:   number
  total_results: number
}

export interface RawMovie {
  id:            number
  title:         string
  overview:      string
  poster_path:   string | null
  vote_average:  number
  vote_count:    number
  release_date:  string
  genre_ids:     number[]
  popularity:    number
}

// ─── Search ───────────────────────────────────────────────────────────────────

export interface SearchResult {
  id:       string
  type:     ContentType
  title:    string
  imageUrl: string | null
  subtitle: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface User {
  id:        string
  name:      string
  email:     string
  avatarUrl: string | null
  createdAt: string
}

// ─── UI State ─────────────────────────────────────────────────────────────────

export interface LoadingState {
  isLoading: boolean
  error:     string | null
}

export type SectionType = 'feed' | 'trending' | 'favorites' | 'settings'

// ─── Drag and Drop ────────────────────────────────────────────────────────────

export interface DragItem {
  id:    string
  index: number
  type:  ContentType
}