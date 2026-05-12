// ============================================================
//   src/lib/utils.ts
//   Pure helper functions used across the entire app
//   Import anywhere: import { formatDate } from '@/lib/utils'
// ============================================================

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { ContentItem, NewsArticle, Movie, RawNewsArticle, RawMovie } from '@/types'
import { TMDB_IMAGE_SIZES, TMDB_GENRE_MAP, FALLBACK_IMAGES } from '@/lib/constants'


// ─── Tailwind Class Helper ────────────────────────────────────────────────────
// Merges Tailwind classes safely, removes duplicates
// Usage: cn('px-4 py-2', isActive && 'bg-brand-500', className)

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}


// ─── Date Formatting ──────────────────────────────────────────────────────────

// Formats ISO date string to readable format
// e.g. "2024-05-10T12:00:00Z" → "May 10, 2024"
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year:  'numeric',
      month: 'long',
      day:   'numeric',
    })
  } catch {
    return 'Unknown date'
  }
}

// Returns relative time string
// e.g. "2 hours ago", "3 days ago", "just now"
export function timeAgo(dateString: string): string {
  try {
    const date  = new Date(dateString)
    const now   = new Date()
    const diffMs = now.getTime() - date.getTime()

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours   = Math.floor(minutes / 60)
    const days    = Math.floor(hours / 24)
    const weeks   = Math.floor(days / 7)
    const months  = Math.floor(days / 30)

    if (seconds < 60)  return 'just now'
    if (minutes < 60)  return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    if (hours < 24)    return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7)      return `${days} day${days > 1 ? 's' : ''} ago`
    if (weeks < 4)     return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    return             `${months} month${months > 1 ? 's' : ''} ago`
  } catch {
    return 'Unknown time'
  }
}


// ─── Text Helpers ─────────────────────────────────────────────────────────────

// Truncates text to a max length and adds ellipsis
// e.g. truncate("Hello World", 8) → "Hello Wo..."
export function truncate(text: string, maxLength: number): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

// Capitalizes first letter of a string
// e.g. "technology" → "Technology"
export function capitalize(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Formats large numbers to short form
// e.g. 1500 → "1.5K", 1200000 → "1.2M"
export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`
  if (num >= 1_000)     return `${(num / 1_000).toFixed(1)}K`
  return num.toString()
}

// Generates a unique ID for mock data
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}


// ─── Image Helpers ────────────────────────────────────────────────────────────

// Returns full TMDB image URL or fallback
export function getTmdbImageUrl(
  path: string | null,
  size: keyof typeof TMDB_IMAGE_SIZES = 'medium'
): string {
  if (!path) return FALLBACK_IMAGES.movie
  return `${TMDB_IMAGE_SIZES[size]}${path}`
}

// Returns image URL or fallback based on content type
export function getImageUrl(item: ContentItem): string {
  if (!item.imageUrl) {
    return FALLBACK_IMAGES[item.type] ?? FALLBACK_IMAGES.news
  }
  return item.imageUrl
}


// ─── Data Normalizers ─────────────────────────────────────────────────────────
// Convert raw API responses into our app's ContentItem format

// Normalizes a raw NewsAPI article into our NewsArticle type
export function normalizeNewsArticle(
  raw: RawNewsArticle,
  category: string = 'general'
): NewsArticle {
  return {
    id:          generateId('news'),
    type:        'news',
    title:       raw.title        || 'Untitled Article',
    description: raw.description  || 'No description available.',
    content:     raw.content      || raw.description || '',
    url:         raw.url,
    imageUrl:    raw.urlToImage,
    source:      raw.source.name  || 'Unknown Source',
    author:      raw.author,
    category:    category as NewsArticle['category'],
    publishedAt: raw.publishedAt,
    isFavorite:  false,
  }
}

// Normalizes a raw TMDB movie into our Movie type
export function normalizeMovie(raw: RawMovie): Movie {
  return {
    id:          `movie_${raw.id}`,
    type:        'movie',
    title:       raw.title       || 'Untitled Movie',
    description: raw.overview    || 'No description available.',
    imageUrl:    raw.poster_path
                   ? getTmdbImageUrl(raw.poster_path, 'medium')
                   : null,
    rating:      Math.round(raw.vote_average * 10) / 10,
    releaseDate: raw.release_date,
    genres:      raw.genre_ids.map(id => TMDB_GENRE_MAP[id]).filter(Boolean),
    voteCount:   raw.vote_count,
    popularity:  raw.popularity,
    isFavorite:  false,
  }
}


// ─── Content Helpers ──────────────────────────────────────────────────────────

// Returns the subtitle text for a content card based on type
export function getCardSubtitle(item: ContentItem): string {
  switch (item.type) {
    case 'news':
      return `${item.source} • ${timeAgo(item.publishedAt)}`
    case 'movie':
      return `⭐ ${item.rating} • ${item.genres.slice(0, 2).join(', ')}`
    case 'social':
      return `@${item.author.username} • ${timeAgo(item.publishedAt)}`
  }
}

// Returns the CTA button label based on content type
export function getCtaLabel(type: ContentItem['type']): string {
  switch (type) {
    case 'news':   return 'Read More'
    case 'movie':  return 'View Details'
    case 'social': return 'View Post'
  }
}

// Filters content items by search query
export function filterByQuery(
  items: ContentItem[],
  query: string
): ContentItem[] {
  if (!query.trim()) return items
  const q = query.toLowerCase()
  return items.filter(item => {
    const title = item.type === 'social' ? item.content : item.title
    return title.toLowerCase().includes(q)
  })
}

// Checks if a content item is favorited
export function isFavorited(id: string, favoriteIds: string[]): boolean {
  return favoriteIds.includes(id)
}


// ─── Local Storage Helpers ────────────────────────────────────────────────────

// Safely gets a value from localStorage
export function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const item = localStorage.getItem(key)
    return item ? (JSON.parse(item) as T) : fallback
  } catch {
    return fallback
  }
}

// Safely sets a value in localStorage
export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error(`Failed to save to localStorage: ${key}`)
  }
}