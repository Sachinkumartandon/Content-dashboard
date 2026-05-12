// ============================================================
//   src/app/api/news/route.ts
//   Next.js Route Handler for News API
//   Endpoint: GET /api/news
//   Query params:
//     - categories: comma separated e.g. "technology,sports"
//     - page: page number e.g. "1"
//     - pageSize: items per page e.g. "10"
//     - query: search term e.g. "bitcoin"
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import {
  fetchTopHeadlines,
  searchNews,
} from '@/lib/newsApi'
import type { Category } from '@/types'


// ─── GET /api/news ────────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── Parse query params ──────────────────────────────────────────────────
    const { searchParams } = request.nextUrl

    const categoriesParam = searchParams.get('categories') || 'general'
    const page            = parseInt(searchParams.get('page')     || '1', 10)
    const pageSize        = parseInt(searchParams.get('pageSize') || '10', 10)
    const query           = searchParams.get('query') || ''

    // Convert comma-separated string to array
    // e.g. "technology,sports" → ['technology', 'sports']
    const categories = categoriesParam
      .split(',')
      .map(c => c.trim())
      .filter(Boolean) as Category[]

    // ── Validate params ─────────────────────────────────────────────────────
    if (page < 1 || page > 100) {
      return NextResponse.json(
        { error: 'Invalid page number. Must be between 1 and 100.' },
        { status: 400 }
      )
    }

    if (pageSize < 1 || pageSize > 50) {
      return NextResponse.json(
        { error: 'Invalid pageSize. Must be between 1 and 50.' },
        { status: 400 }
      )
    }

    // ── Fetch data ──────────────────────────────────────────────────────────
    let articles

    if (query.trim()) {
      // Search mode — use query string
      articles = await searchNews(query, page, pageSize)
    } else {
      // Browse mode — use categories
      articles = await fetchTopHeadlines(categories, page, pageSize)
    }

    // ── Return response ─────────────────────────────────────────────────────
    return NextResponse.json(
      {
        data:       articles,
        status:     200,
        message:    'Success',
        totalCount: articles.length,
        page,
        totalPages: 5, // NewsAPI free tier max
      },
      {
        status: 200,
        headers: {
          // Cache response in browser for 5 minutes
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=60',
        },
      }
    )

  } catch (error) {
    console.error('[GET /api/news] Error:', error)

    return NextResponse.json(
      {
        error:   'Failed to fetch news articles.',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


// ─── OPTIONS /api/news ────────────────────────────────────────────────────────
// Handle CORS preflight requests

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