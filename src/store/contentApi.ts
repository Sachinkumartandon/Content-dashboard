// ============================================================
//   src/store/contentApi.ts — FIXED VERSION
//   RTK Query API Slice with working search
// ============================================================

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { NewsArticle, Movie, SocialPost, ApiResponse, Category } from '@/types'
import { mockNews, mockMovies, mockSocialPosts } from '@/lib/mockData'


// ─── Helper — filter mock data locally ───────────────────────────────────────

function searchMockNews(query: string): NewsArticle[] {
  const q = query.toLowerCase()
  return mockNews.filter(a =>
    a.title.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q) ||
    a.category.toLowerCase().includes(q)
  )
}

function searchMockMovies(query: string): Movie[] {
  const q = query.toLowerCase()
  return mockMovies.filter(m =>
    m.title.toLowerCase().includes(q) ||
    m.description.toLowerCase().includes(q) ||
    m.genres.some(g => g.toLowerCase().includes(q))
  )
}

function searchMockSocial(query: string): SocialPost[] {
  const q = query.toLowerCase()
  return mockSocialPosts.filter(p =>
    p.content.toLowerCase().includes(q) ||
    p.hashtags.some(h => h.toLowerCase().includes(q)) ||
    p.author.username.toLowerCase().includes(q)
  )
}


// ─── API Slice ────────────────────────────────────────────────────────────────

export const contentApi = createApi({
  reducerPath: 'contentApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['News', 'Movies', 'Social', 'Trending', 'Search'],

  endpoints: (builder) => ({

    // ── Fetch News ──────────────────────────────────────────────────────────
    fetchNews: builder.query<
      ApiResponse<NewsArticle[]>,
      { categories: Category[]; page?: number; pageSize?: number }
    >({
      queryFn: async ({ categories, page = 1, pageSize = 10 }, _api, _extra, baseQuery) => {
        try {
          const result = await baseQuery({
            url: 'news',
            params: { categories: categories.join(','), page, pageSize },
          })
          if (result.error) {
            // Fallback to mock data
            return {
              data: {
                data: mockNews,
                status: 200,
                message: 'Mock data',
                totalCount: mockNews.length,
                page: 1,
                totalPages: 1,
              }
            }
          }
          return { data: result.data as ApiResponse<NewsArticle[]> }
        } catch {
          return {
            data: {
              data: mockNews,
              status: 200,
              message: 'Mock data',
              totalCount: mockNews.length,
              page: 1,
              totalPages: 1,
            }
          }
        }
      },
      providesTags: ['News'],
      keepUnusedDataFor: 300,
    }),

    // ── Fetch Movie Recommendations ─────────────────────────────────────────
    fetchRecommendations: builder.query<
      ApiResponse<Movie[]>,
      { categories: Category[]; page?: number }
    >({
      queryFn: async ({ categories, page = 1 }, _api, _extra, baseQuery) => {
        try {
          const result = await baseQuery({
            url: 'recommendations',
            params: { categories: categories.join(','), page },
          })
          if (result.error) {
            return {
              data: {
                data: mockMovies,
                status: 200,
                message: 'Mock data',
                totalCount: mockMovies.length,
                page: 1,
                totalPages: 1,
              }
            }
          }
          return { data: result.data as ApiResponse<Movie[]> }
        } catch {
          return {
            data: {
              data: mockMovies,
              status: 200,
              message: 'Mock data',
              totalCount: mockMovies.length,
              page: 1,
              totalPages: 1,
            }
          }
        }
      },
      providesTags: ['Movies'],
      keepUnusedDataFor: 1800,
    }),

    // ── Fetch Trending Movies ───────────────────────────────────────────────
    fetchTrendingMovies: builder.query<ApiResponse<Movie[]>, void>({
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        try {
          const result = await baseQuery({ url: 'recommendations', params: { trending: 'true' } })
          if (result.error) {
            return { data: { data: mockMovies.slice(0, 5), status: 200, message: 'Mock', totalCount: 5, page: 1, totalPages: 1 } }
          }
          return { data: result.data as ApiResponse<Movie[]> }
        } catch {
          return { data: { data: mockMovies.slice(0, 5), status: 200, message: 'Mock', totalCount: 5, page: 1, totalPages: 1 } }
        }
      },
      providesTags: ['Trending'],
      keepUnusedDataFor: 600,
    }),

    // ── Fetch Social Posts ──────────────────────────────────────────────────
    fetchSocialPosts: builder.query<
      ApiResponse<SocialPost[]>,
      { page?: number; pageSize?: number; platform?: string }
    >({
      queryFn: async ({ page = 1, pageSize = 6, platform = '' }, _api, _extra, baseQuery) => {
        try {
          const result = await baseQuery({ url: 'social', params: { page, pageSize, platform } })
          if (result.error) {
            return { data: { data: mockSocialPosts, status: 200, message: 'Mock', totalCount: mockSocialPosts.length, page: 1, totalPages: 1 } }
          }
          return { data: result.data as ApiResponse<SocialPost[]> }
        } catch {
          return { data: { data: mockSocialPosts, status: 200, message: 'Mock', totalCount: mockSocialPosts.length, page: 1, totalPages: 1 } }
        }
      },
      providesTags: ['Social'],
      keepUnusedDataFor: 120,
    }),

    // ── Fetch Trending Social ───────────────────────────────────────────────
    fetchTrendingSocial: builder.query<ApiResponse<SocialPost[]>, void>({
      queryFn: async (_arg, _api, _extra, baseQuery) => {
        try {
          const result = await baseQuery({ url: 'social', params: { trending: 'true' } })
          if (result.error) {
            return { data: { data: mockSocialPosts.slice(0, 5), status: 200, message: 'Mock', totalCount: 5, page: 1, totalPages: 1 } }
          }
          return { data: result.data as ApiResponse<SocialPost[]> }
        } catch {
          return { data: { data: mockSocialPosts.slice(0, 5), status: 200, message: 'Mock', totalCount: 5, page: 1, totalPages: 1 } }
        }
      },
      providesTags: ['Trending'],
      keepUnusedDataFor: 120,
    }),

    // ── Search All — FIXED with mock data fallback ──────────────────────────
    searchAll: builder.query<
      { news: NewsArticle[]; movies: Movie[]; social: SocialPost[] },
      { query: string }
    >({
      queryFn: async ({ query }, _api, _extra, baseQuery) => {
        if (!query || query.trim().length < 2) {
          return { data: { news: [], movies: [], social: [] } }
        }

        try {
          // Try real APIs first
          const [newsRes, moviesRes, socialRes] = await Promise.allSettled([
            baseQuery({ url: 'news',            params: { query } }),
            baseQuery({ url: 'recommendations', params: { query } }),
            baseQuery({ url: 'social',          params: { query } }),
          ])

          const news = newsRes.status === 'fulfilled' && !newsRes.value.error
            ? (newsRes.value.data as ApiResponse<NewsArticle[]>)?.data || []
            : searchMockNews(query)

          const movies = moviesRes.status === 'fulfilled' && !moviesRes.value.error
            ? (moviesRes.value.data as ApiResponse<Movie[]>)?.data || []
            : searchMockMovies(query)

          const social = socialRes.status === 'fulfilled' && !socialRes.value.error
            ? (socialRes.value.data as ApiResponse<SocialPost[]>)?.data || []
            : searchMockSocial(query)

          // If ALL apis returned empty — use mock search
          const totalResults = news.length + movies.length + social.length
          if (totalResults === 0) {
            return {
              data: {
                news:   searchMockNews(query),
                movies: searchMockMovies(query),
                social: searchMockSocial(query),
              }
            }
          }

          return { data: { news, movies, social } }

        } catch {
          // Full fallback to mock data search
          return {
            data: {
              news:   searchMockNews(query),
              movies: searchMockMovies(query),
              social: searchMockSocial(query),
            }
          }
        }
      },
      providesTags: ['Search'],
      keepUnusedDataFor: 60,
    }),
  }),
})


// ─── Export Hooks ─────────────────────────────────────────────────────────────

export const {
  useFetchNewsQuery,
  useFetchRecommendationsQuery,
  useFetchTrendingMoviesQuery,
  useFetchSocialPostsQuery,
  useFetchTrendingSocialQuery,
  useSearchAllQuery,
} = contentApi

export default contentApi.reducer