// ============================================================
//   src/app/api/recommendations/route.ts
//   Next.js Route Handler for Movie Recommendations
//   Endpoint: GET /api/recommendations
//   Query params:
//     - categories: comma separated e.g. "technology,entertainment"
//     - page: page number e.g. "1"
//     - query: search term e.g. "batman"
//     - genreId: TMDB genre ID e.g. "28"
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import {
  fetchRecommendations,
  fetchPopularMovies,
  fetchTrendingMovies,
  searchMovies,
} from '@/lib/tmdbApi'


// ─── GET /api/recommendations ─────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── Parse query params ──────────────────────────────────────────────────
    const { searchParams } = request.nextUrl

    const categoriesParam = searchParams.get('categories') || 'general'
    const page            = parseInt(searchParams.get('page')    || '1', 10)
    const query           = searchParams.get('query')   || ''
    const trending        = searchParams.get('trending') || 'false'

    // Convert comma-separated string to array
    const categories = categoriesParam
      .split(',')
      .map(c => c.trim())
      .filter(Boolean)

    // ── Validate params ─────────────────────────────────────────────────────
    if (page < 1 || page > 500) {
      return NextResponse.json(
        { error: 'Invalid page number. Must be between 1 and 500.' },
        { status: 400 }
      )
    }

    // ── Fetch data ──────────────────────────────────────────────────────────
    let movies

    if (query.trim()) {
      // Search mode
      movies = await searchMovies(query, page)

    } else if (trending === 'true') {
      // Trending mode
      movies = await fetchTrendingMovies()

    } else if (
      categories.length === 0 ||
      (categories.length === 1 && categories[0] === 'general')
    ) {
      // No specific category — return popular movies
      movies = await fetchPopularMovies(page)

    } else {
      // Category-based recommendations
      movies = await fetchRecommendations(categories, page)
    }

    // ── Return response ─────────────────────────────────────────────────────
    return NextResponse.json(
      {
        data:       movies,
        status:     200,
        message:    'Success',
        totalCount: movies.length,
        page,
        totalPages: 500, // TMDB supports up to 500 pages
      },
      {
        status: 200,
        headers: {
          // Cache for 30 minutes — movies don't change often
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=300',
        },
      }
    )

  } catch (error) {
    console.error('[GET /api/recommendations] Error:', error)

    return NextResponse.json(
      {
        error:   'Failed to fetch movie recommendations.',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


// ─── OPTIONS /api/recommendations ────────────────────────────────────────────

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin':  '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  )
}