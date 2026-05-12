// ============================================================
//   src/components/feed/FeedContainer.tsx — FIXED VERSION
// ============================================================

'use client'

import { useEffect, useMemo }        from 'react'
import { AnimatePresence, motion }   from 'framer-motion'
import { useAppDispatch,
         useAppSelector }            from '@/store'
import { selectSearchQuery,
         selectCurrentPage,
         setOrderedIds,
         reorderCards,
         nextPage }                  from '@/store/feedSlice'
import { selectCategories }          from '@/store/preferencesSlice'
import {
  useFetchNewsQuery,
  useFetchRecommendationsQuery,
  useFetchSocialPostsQuery,
  useSearchAllQuery,
}                                    from '@/store/contentApi'
import DraggableCard                 from '@/components/feed/DraggableCard'
import { FeedSkeleton }              from '@/components/ui/Skeleton'
import { useInfiniteScroll }         from '@/hooks/useInfiniteScroll'
import { cn }                        from '@/lib/utils'
import { mockNews, mockMovies, mockSocialPosts } from '@/lib/mockData'
import type { ContentItem }          from '@/types'


// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ query }: { query?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      className='flex flex-col items-center justify-center py-20 text-center'
    >
      <div className='text-6xl mb-4'>{query ? '🔍' : '📭'}</div>
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
        {query ? `No results for "${query}"` : 'No content available'}
      </h3>
      <p className='text-sm text-[var(--text-muted)] max-w-sm'>
        {query
          ? 'Try a different search term like: apple, dune, coding, react'
          : 'Try selecting different categories in your settings.'}
      </p>
    </motion.div>
  )
}


// ─── Error State ──────────────────────────────────────────────────────────────

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      className='flex flex-col items-center justify-center py-20 text-center'
    >
      <div className='text-6xl mb-4'>⚠️</div>
      <h3 className='text-lg font-semibold text-[var(--text-primary)] mb-2'>
        Failed to load content
      </h3>
      <p className='text-sm text-[var(--text-muted)] mb-6 max-w-sm'>
        Using mock data as fallback.
      </p>
      <button onClick={onRetry} className='btn-primary'>Try Again</button>
    </motion.div>
  )
}


// ─── Load More Indicator ──────────────────────────────────────────────────────

function LoadMoreIndicator({ isFetching }: { isFetching: boolean }) {
  return (
    <div className='flex justify-center py-8'>
      {isFetching ? (
        <div className='flex items-center gap-2 text-[var(--text-muted)]'>
          <div className='w-5 h-5 border-2 border-brand-200 border-t-brand-500 rounded-full animate-spin' />
          <span className='text-sm'>Loading more...</span>
        </div>
      ) : (
        <p className='text-sm text-[var(--text-muted)]'>You are all caught up 🎉</p>
      )}
    </div>
  )
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function FeedContainer() {
  const dispatch    = useAppDispatch()
  const searchQuery = useAppSelector(selectSearchQuery)
  const categories  = useAppSelector(selectCategories)
  const currentPage = useAppSelector(selectCurrentPage)

  // Is the user currently searching?
  const isSearching = searchQuery.trim().length >= 2

  // ── Search mode ─────────────────────────────────────────────────────────
  const {
    data:      searchData,
    isLoading: searchLoading,
  
  } = useSearchAllQuery(
    { query: searchQuery },
    { skip: !isSearching }
  )

  // ── Browse mode ─────────────────────────────────────────────────────────
  const {
    data:      newsData,
    isLoading: newsLoading,
    isError:   newsError,
    refetch:   refetchNews,
  } = useFetchNewsQuery(
    { categories, page: currentPage },
    { skip: isSearching }
  )

  const {
    data:      moviesData,
    isLoading: moviesLoading,
    refetch:   refetchMovies,
  } = useFetchRecommendationsQuery(
    { categories, page: currentPage },
    { skip: isSearching }
  )

  const {
    data:      socialData,
    isLoading: socialLoading,
    refetch:   refetchSocial,
  } = useFetchSocialPostsQuery(
    { page: currentPage },
    { skip: isSearching }
  )

  // ── Build feed items ────────────────────────────────────────────────────

  const feedItems = useMemo<ContentItem[]>(() => {

    // SEARCH MODE
    if (isSearching) {
      if (!searchData) return []
      const combined = [
        ...(searchData.news   || []),
        ...(searchData.movies || []),
        ...(searchData.social || []),
      ]
      // If search returned nothing — show ALL mock data as fallback
      if (combined.length === 0) return []
      return combined
    }

    // BROWSE MODE — interleave all three content types
    const news   = newsData?.data   || mockNews
    const movies = moviesData?.data || mockMovies
    const social = socialData?.data || mockSocialPosts

    const maxLen = Math.max(news.length, movies.length, social.length)
    const result: ContentItem[] = []

    for (let i = 0; i < maxLen; i++) {
      if (news[i])   result.push(news[i])
      if (movies[i]) result.push(movies[i])
      if (social[i]) result.push(social[i])
    }

    return result
  }, [isSearching, searchData, newsData, moviesData, socialData])

  // Sync IDs to Redux for drag-drop ordering
  useEffect(() => {
    if (feedItems.length > 0) {
      dispatch(setOrderedIds(feedItems.map(i => i.id)))
    }
  }, [feedItems, dispatch])

  // ── Loading state ───────────────────────────────────────────────────────
  const isLoading = isSearching
    ? searchLoading
    : newsLoading || moviesLoading || socialLoading

  const hasNextPage = !isSearching && currentPage < 5

  // ── Infinite scroll ─────────────────────────────────────────────────────
  const { sentinelRef, isFetching } = useInfiniteScroll({
    onIntersect: () => dispatch(nextPage()),
    hasNextPage,
    isLoading,
  })

  // ── Drag and drop ───────────────────────────────────────────────────────
  const handleMove = (fromIndex: number, toIndex: number) => {
    dispatch(reorderCards({ fromIndex, toIndex }))
  }

  const handleRetry = () => {
    refetchNews()
    refetchMovies()
    refetchSocial()
  }

  // ── Render ──────────────────────────────────────────────────────────────

  if (isLoading && feedItems.length === 0) {
    return <FeedSkeleton count={6} />
  }

  if (newsError && feedItems.length === 0) {
    return <ErrorState onRetry={handleRetry} />
  }

  if (!isLoading && feedItems.length === 0) {
    return <EmptyState query={isSearching ? searchQuery : undefined} />
  }

  return (
    <div className='space-y-6'>

      {/* Feed Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-[var(--text-primary)]'>
          {isSearching ? `Results for "${searchQuery}"` : 'Your Feed'}
        </h2>
        <span className='text-sm text-[var(--text-muted)]'>
          {feedItems.length} items
        </span>
      </div>

      {/* Content Grid */}
      <AnimatePresence mode='popLayout'>
        <motion.div
          layout
          className={cn(
            'grid gap-6',
            'grid-cols-1',
            'sm:grid-cols-2',
            'lg:grid-cols-3',
          )}
        >
          {feedItems.map((item, index) => (
            <DraggableCard
              key={item.id}
              item={item}
              index={index}
              onMove={handleMove}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} aria-hidden='true' />

      <LoadMoreIndicator isFetching={isFetching} />

    </div>
  )
}