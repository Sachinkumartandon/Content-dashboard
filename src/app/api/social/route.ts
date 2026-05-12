// ============================================================
//   src/app/api/social/route.ts
//   Next.js Route Handler for Social Media Posts
//   Uses mock API since Twitter/Instagram are paid/restricted
//   Endpoint: GET /api/social
//   Query params:
//     - page: page number e.g. "1"
//     - pageSize: items per page e.g. "6"
//     - hashtag: filter by hashtag e.g. "ReactJS"
//     - platform: filter by platform e.g. "twitter" | "instagram"
//     - query: search term e.g. "coding"
//     - trending: get trending posts e.g. "true"
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import {
  fetchSocialPosts,
  fetchPostsByHashtag,
  fetchPostsByPlatform,
  fetchTrendingSocialPosts,
  searchSocialPosts,
} from '@/lib/mockSocialApi'


// ─── GET /api/social ──────────────────────────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // ── Parse query params ──────────────────────────────────────────────────
    const { searchParams } = request.nextUrl

    const page      = parseInt(searchParams.get('page')     || '1', 10)
    const pageSize  = parseInt(searchParams.get('pageSize') || '6', 10)
    const hashtag   = searchParams.get('hashtag')  || ''
    const platform  = searchParams.get('platform') || ''
    const query     = searchParams.get('query')    || ''
    const trending  = searchParams.get('trending') || 'false'

    // ── Validate params ─────────────────────────────────────────────────────
    if (page < 1) {
      return NextResponse.json(
        { error: 'Invalid page number. Must be at least 1.' },
        { status: 400 }
      )
    }

    if (pageSize < 1 || pageSize > 20) {
      return NextResponse.json(
        { error: 'Invalid pageSize. Must be between 1 and 20.' },
        { status: 400 }
      )
    }

    if (
      platform &&
      platform !== 'twitter' &&
      platform !== 'instagram'
    ) {
      return NextResponse.json(
        { error: 'Invalid platform. Must be "twitter" or "instagram".' },
        { status: 400 }
      )
    }

    // ── Fetch data ──────────────────────────────────────────────────────────
    let posts

    if (query.trim()) {
      // Search mode
      posts = await searchSocialPosts(query)

    } else if (trending === 'true') {
      // Trending mode
      posts = await fetchTrendingSocialPosts()

    } else if (hashtag.trim()) {
      // Filter by hashtag
      posts = await fetchPostsByHashtag(hashtag, page, pageSize)

    } else if (
      platform === 'twitter' ||
      platform === 'instagram'
    ) {
      // Filter by platform
      posts = await fetchPostsByPlatform(platform, page, pageSize)

    } else {
      // Default — fetch all posts paginated
      posts = await fetchSocialPosts(page, pageSize)
    }

    // ── Return response ─────────────────────────────────────────────────────
    return NextResponse.json(
      {
        data:       posts,
        status:     200,
        message:    'Success',
        totalCount: posts.length,
        page,
        totalPages: 3, // mock data has ~12 posts = 3 pages of 4
      },
      {
        status: 200,
        headers: {
          // Social posts change often — cache for only 2 minutes
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=30',
        },
      }
    )

  } catch (error) {
    console.error('[GET /api/social] Error:', error)

    return NextResponse.json(
      {
        error:   'Failed to fetch social media posts.',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}


// ─── OPTIONS /api/social ──────────────────────────────────────────────────────

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