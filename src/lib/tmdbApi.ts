// ============================================================
//   src/lib/tmdbApi.ts
//   Server-side only — never import this in client components
//   Fetches movie recommendations from TMDB API
//   Falls back to mock data if API key is missing
// ============================================================

import type { Movie, RawMovie, TmdbResponse } from '@/types'
import { normalizeMovie }      from '@/lib/utils'
import { mockMovies }          from '@/lib/mockData'
import { TMDB_API_BASE_URL, TMDB_GENRE_MAP } from '@/lib/constants'


// ─── Config ───────────────────────────────────────────────────────────────────

const API_KEY  = process.env.TMDB_API_KEY
const BASE_URL = TMDB_API_BASE_URL

// Check if API key is available
const hasApiKey = !!API_KEY && API_KEY !== 'your_tmdb_api_key_here'

// Common headers for TMDB requests
const headers = {
  'Content-Type': 'application/json',
}


// ─── Helper ───────────────────────────────────────────────────────────────────

// Builds TMDB URL with api_key param
function buildUrl(
  endpoint: string,
  params: Record<string, string> = {}
): string {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  url.searchParams.set('api_key', API_KEY || '')
  url.searchParams.set('language', 'en-US')
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}

// Maps category name to TMDB genre ID
function categoryToGenreId(category: string): string | null {
  const map: Record<string, string> = {
    technology:    '878',  // Science Fiction
    entertainment: '35',   // Comedy
    sports:        '28',   // Action
    finance:       '18',   // Drama
    health:        '99',   // Documentary
    science:       '878',  // Science Fiction
    business:      '18',   // Drama
    general:       '',     // no genre filter
  }
  return map[category] || null
}


// ─── Fetch Popular Movies ─────────────────────────────────────────────────────

export async function fetchPopularMovies(
  page: number = 1
): Promise<Movie[]> {

  // Return mock data if no API key
  if (!hasApiKey) {
    console.warn('[TMDB] No API key found — using mock data')
    return mockMovies
  }

  try {
    const url = buildUrl('movie/popular', {
      page: String(page),
    })

    const response = await fetch(url, {
      headers,
      next: { revalidate: 1800 }, // cache for 30 minutes
    })

    if (!response.ok) {
      console.error(`[TMDB] Error: ${response.status} ${response.statusText}`)
      return mockMovies
    }

    const data: TmdbResponse = await response.json()

    if (!data.results?.length) {
      return mockMovies
    }

    return data.results.map((movie: RawMovie) => normalizeMovie(movie))

  } catch (error) {
    console.error('[TMDB] Fetch failed:', error)
    return mockMovies // graceful fallback
  }
}


// ─── Fetch Movies by Genre ────────────────────────────────────────────────────

export async function fetchMoviesByGenre(
  genreId: string,
  page: number = 1
): Promise<Movie[]> {

  if (!hasApiKey) {
    return mockMovies.filter(m =>
      m.genres.some(g =>
        TMDB_GENRE_MAP[Number(genreId)]?.includes(g)
      )
    )
  }

  try {
    const url = buildUrl('discover/movie', {
      with_genres:  genreId,
      sort_by:      'popularity.desc',
      page:         String(page),
    })

    const response = await fetch(url, {
      headers,
      next: { revalidate: 1800 },
    })

    if (!response.ok) return mockMovies

    const data: TmdbResponse = await response.json()

    if (!data.results?.length) return mockMovies

    return data.results.map((movie: RawMovie) => normalizeMovie(movie))

  } catch (error) {
    console.error('[TMDB] Genre fetch failed:', error)
    return mockMovies
  }
}


// ─── Fetch Recommendations by Category ───────────────────────────────────────

export async function fetchRecommendations(
  categories: string[] = ['general'],
  page: number = 1
): Promise<Movie[]> {

  if (!hasApiKey) {
    return mockMovies
  }

  try {
    // Pick first non-general category for genre filtering
    const category  = categories.find(c => c !== 'general') || 'general'
    const genreId   = categoryToGenreId(category)

    // If we have a genre ID, fetch by genre; otherwise fetch popular
    if (genreId) {
      return await fetchMoviesByGenre(genreId, page)
    } else {
      return await fetchPopularMovies(page)
    }

  } catch (error) {
    console.error('[TMDB] Recommendations fetch failed:', error)
    return mockMovies
  }
}


// ─── Search Movies ────────────────────────────────────────────────────────────

export async function searchMovies(
  query: string,
  page: number = 1
): Promise<Movie[]> {

  if (!query.trim()) return []

  // Filter mock data locally if no API key
  if (!hasApiKey) {
    return mockMovies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      movie.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  try {
    const url = buildUrl('search/movie', {
      query:         encodeURIComponent(query),
      page:          String(page),
      include_adult: 'false',
    })

    const response = await fetch(url, {
      headers,
      next: { revalidate: 60 },
    })

    if (!response.ok) return []

    const data: TmdbResponse = await response.json()

    if (!data.results?.length) return []

    return data.results
      .filter((m: RawMovie) => m.poster_path) // only movies with posters
      .map((m: RawMovie)    => normalizeMovie(m))

  } catch (error) {
    console.error('[TMDB] Search failed:', error)
    return []
  }
}


// ─── Fetch Trending Movies ────────────────────────────────────────────────────

export async function fetchTrendingMovies(): Promise<Movie[]> {

  if (!hasApiKey) {
    return mockMovies.slice(0, 5)
  }

  try {
    const url = buildUrl('trending/movie/day')

    const response = await fetch(url, {
      headers,
      next: { revalidate: 600 }, // cache for 10 minutes
    })

    if (!response.ok) return mockMovies.slice(0, 5)

    const data: TmdbResponse = await response.json()

    if (!data.results?.length) return mockMovies.slice(0, 5)

    return data.results
      .slice(0, 5)
      .map((m: RawMovie) => normalizeMovie(m))

  } catch {
    return mockMovies.slice(0, 5)
  }
}