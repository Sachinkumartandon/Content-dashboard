// ============================================================
//   src/lib/newsApi.ts
//   Server-side only — never import this in client components
//   Fetches news from NewsAPI.org
//   Falls back to mock data if API key is missing
// ============================================================

import type { NewsArticle, RawNewsArticle, NewsApiResponse, Category } from '@/types'
import { normalizeNewsArticle }  from '@/lib/utils'
import { mockNews }              from '@/lib/mockData'
import { NEWS_API_BASE_URL }     from '@/lib/constants'


// ─── Config ───────────────────────────────────────────────────────────────────

const API_KEY = process.env.NEWS_API_KEY
const BASE_URL = NEWS_API_BASE_URL

// Check if API key is available
const hasApiKey = !!API_KEY && API_KEY !== 'your_newsapi_key_here'


// ─── Helper ───────────────────────────────────────────────────────────────────

// Builds the fetch URL with query params
function buildUrl(endpoint: string, params: Record<string, string>): string {
  const url = new URL(`${BASE_URL}/${endpoint}`)
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value)
  })
  return url.toString()
}


// ─── Fetch Top Headlines ──────────────────────────────────────────────────────

export async function fetchTopHeadlines(
  categories: Category[] = ['general'],
  page: number = 1,
  pageSize: number = 10
): Promise<NewsArticle[]> {

  // Return mock data if no API key
  if (!hasApiKey) {
    console.warn('[NewsAPI] No API key found — using mock data')
    return mockNews
  }

  try {
    const allArticles: NewsArticle[] = []

    // Fetch for each selected category
    for (const category of categories.slice(0, 3)) { // max 3 categories
      const url = buildUrl('top-headlines', {
        category: category === 'finance' ? 'business' : category,
        language: 'en',
        page:     String(page),
        pageSize: String(Math.ceil(pageSize / categories.length)),
        apiKey:   API_KEY!,
      })

      const response = await fetch(url, {
        next: { revalidate: 300 }, // cache for 5 minutes
      })

      if (!response.ok) {
        console.error(`[NewsAPI] Error: ${response.status} ${response.statusText}`)
        continue
      }

      const data: NewsApiResponse = await response.json()

      if (data.status === 'error') {
        console.error('[NewsAPI] API Error:', data)
        continue
      }

      // Filter out articles with missing titles or [Removed] content
      const filtered = data.articles.filter(
        (article: RawNewsArticle) =>
          article.title &&
          article.title !== '[Removed]' &&
          article.url
      )

      const normalized = filtered.map((article: RawNewsArticle) =>
        normalizeNewsArticle(article, category)
      )

      allArticles.push(...normalized)
    }

    // Return mock data if API returned nothing
    if (allArticles.length === 0) {
      console.warn('[NewsAPI] No articles returned — using mock data')
      return mockNews
    }

    return allArticles

  } catch (error) {
    console.error('[NewsAPI] Fetch failed:', error)
    return mockNews // graceful fallback
  }
}


// ─── Search News ──────────────────────────────────────────────────────────────

export async function searchNews(
  query: string,
  page: number = 1,
  pageSize: number = 10
): Promise<NewsArticle[]> {

  if (!query.trim()) return []

  // Return filtered mock data if no API key
  if (!hasApiKey) {
    return mockNews.filter(article =>
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    )
  }

  try {
    const url = buildUrl('everything', {
      q:        query,
      language: 'en',
      sortBy:   'publishedAt',
      page:     String(page),
      pageSize: String(pageSize),
      apiKey:   API_KEY!,
    })

    const response = await fetch(url, {
      next: { revalidate: 60 }, // cache for 1 minute
    })

    if (!response.ok) {
      console.error(`[NewsAPI] Search Error: ${response.status}`)
      return []
    }

    const data: NewsApiResponse = await response.json()

    const filtered = data.articles.filter(
      (article: RawNewsArticle) =>
        article.title &&
        article.title !== '[Removed]' &&
        article.url
    )

    return filtered.map((article: RawNewsArticle) =>
      normalizeNewsArticle(article, 'general')
    )

  } catch (error) {
    console.error('[NewsAPI] Search failed:', error)
    return []
  }
}


// ─── Fetch Trending News ──────────────────────────────────────────────────────

export async function fetchTrendingNews(): Promise<NewsArticle[]> {

  if (!hasApiKey) {
    return mockNews.slice(0, 5)
  }

  try {
    const url = buildUrl('top-headlines', {
      language: 'en',
      pageSize: '5',
      apiKey:   API_KEY!,
    })

    const response = await fetch(url, {
      next: { revalidate: 600 }, // cache for 10 minutes
    })

    if (!response.ok) return mockNews.slice(0, 5)

    const data: NewsApiResponse = await response.json()

    const filtered = data.articles.filter(
      (a: RawNewsArticle) => a.title && a.title !== '[Removed]'
    )

    return filtered
      .slice(0, 5)
      .map((a: RawNewsArticle) => normalizeNewsArticle(a, 'general'))

  } catch {
    return mockNews.slice(0, 5)
  }
}