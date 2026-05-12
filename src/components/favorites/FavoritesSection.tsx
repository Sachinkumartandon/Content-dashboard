// ============================================================
//   src/components/favorites/FavoritesSection.tsx
//   Shows all content items the user has marked as favorite
//   - Reads favorite IDs from Redux
//   - Fetches full content to display
//   - Clear all favorites button
//   - Empty state when no favorites
// ============================================================

'use client'

import { useMemo }                   from 'react'
import { motion, AnimatePresence }   from 'framer-motion'
import { useAppDispatch,
         useAppSelector }            from '@/store'
import { selectFavoriteIds,
         clearFavorites }            from '@/store/favoritesSlice'
import {
  useFetchNewsQuery,
  useFetchRecommendationsQuery,
  useFetchSocialPostsQuery,
}                                    from '@/store/contentApi'
import { selectCategories }          from '@/store/preferencesSlice'
import ContentCard                   from '@/components/feed/ContentCard'
import { FeedSkeleton }              from '@/components/ui/Skeleton'
import { cn }                        from '@/lib/utils'
import type { ContentItem }          from '@/types'


// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyFavorites() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      className='flex flex-col items-center justify-center py-24 text-center'
    >
      {/* Animated heart */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration:   1.5,
          repeat:     Infinity,
          ease:       'easeInOut',
        }}
        className='text-7xl mb-6'
      >
        🤍
      </motion.div>

      <h3 className='text-xl font-semibold text-[var(--text-primary)] mb-3'>
        No favorites yet
      </h3>

      <p className='text-sm text-[var(--text-muted)] max-w-sm leading-relaxed'>
        Browse your feed and tap the{' '}
        <span className='text-red-400'>❤️</span>{' '}
        heart on any card to save it here for later.
      </p>
    </motion.div>
  )
}


// ─── Stats Bar ────────────────────────────────────────────────────────────────

function StatsBar({
  total,
  news,
  movies,
  social,
  onClear,
}: {
  total:   number
  news:    number
  movies:  number
  social:  number
  onClear: () => void
}) {
  return (
    <div className={cn(
      'flex items-center justify-between',
      'p-4 rounded-xl',
      'bg-[var(--surface-primary)]',
      'border border-[var(--border-primary)]',
    )}>
      {/* Stats */}
      <div className='flex items-center gap-6'>
        <div className='text-center'>
          <p className='text-xl font-bold text-brand-500'>{total}</p>
          <p className='text-xs text-[var(--text-muted)]'>Total</p>
        </div>
        <div className='w-px h-8 bg-[var(--border-primary)]' />
        <div className='flex items-center gap-4 text-sm text-[var(--text-secondary)]'>
          {news   > 0 && <span>📰 {news}   news</span>}
          {movies > 0 && <span>🎬 {movies} movies</span>}
          {social > 0 && <span>💬 {social} posts</span>}
        </div>
      </div>

      {/* Clear All Button */}
      <button
        onClick={onClear}
        className={cn(
          'text-sm text-red-500 hover:text-red-600',
          'hover:bg-red-50 dark:hover:bg-red-900/20',
          'px-3 py-1.5 rounded-lg',
          'transition-colors duration-200',
          'font-medium',
        )}
        aria-label='Clear all favorites'
      >
        Clear All
      </button>
    </div>
  )
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function FavoritesSection() {
  const dispatch     = useAppDispatch()
  const favoriteIds  = useAppSelector(selectFavoriteIds)
  const categories   = useAppSelector(selectCategories)

  // Fetch all content to find favorited items
  const { data: newsData,   isLoading: newsLoading   } =
    useFetchNewsQuery({ categories, page: 1 })

  const { data: moviesData, isLoading: moviesLoading } =
    useFetchRecommendationsQuery({ categories, page: 1 })

  const { data: socialData, isLoading: socialLoading } =
    useFetchSocialPostsQuery({ page: 1 })

  const isLoading = newsLoading || moviesLoading || socialLoading

  // ── Filter to only favorited items ──────────────────────────────────────
  const favoriteItems = useMemo<ContentItem[]>(() => {
    if (favoriteIds.length === 0) return []

    const allItems: ContentItem[] = [
      ...(newsData?.data   || []),
      ...(moviesData?.data || []),
      ...(socialData?.data || []),
    ]

    // Keep only items whose ID is in favoriteIds
    // Preserve the order of favoriteIds
    return favoriteIds
      .map(id => allItems.find(item => item.id === id))
      .filter((item): item is ContentItem => item !== undefined)
  }, [favoriteIds, newsData, moviesData, socialData])

  // ── Stats ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:  favoriteItems.length,
    news:   favoriteItems.filter(i => i.type === 'news').length,
    movies: favoriteItems.filter(i => i.type === 'movie').length,
    social: favoriteItems.filter(i => i.type === 'social').length,
  }), [favoriteItems])

  // ── Handle Clear All ────────────────────────────────────────────────────
  const handleClearAll = () => {
    if (window.confirm('Clear all favorites? This cannot be undone.')) {
      dispatch(clearFavorites())
    }
  }

  // ── Loading state ───────────────────────────────────────────────────────
  if (isLoading && favoriteIds.length > 0) {
    return (
      <div className='space-y-6'>
        <h2 className='text-xl font-bold text-[var(--text-primary)]'>
          ❤️ Your Favorites
        </h2>
        <FeedSkeleton count={3} />
      </div>
    )
  }

  // ── Empty state ─────────────────────────────────────────────────────────
  if (favoriteIds.length === 0) {
    return (
      <div className='space-y-4'>
        <h2 className='text-xl font-bold text-[var(--text-primary)]'>
          ❤️ Your Favorites
        </h2>
        <EmptyFavorites />
      </div>
    )
  }

  return (
    <div className='space-y-6'>

      {/* ── Page Header ── */}
      <div>
        <h2 className='text-xl font-bold text-[var(--text-primary)]'>
          ❤️ Your Favorites
        </h2>
        <p className='text-sm text-[var(--text-muted)] mt-1'>
          All your saved content in one place
        </p>
      </div>

      {/* ── Stats Bar ── */}
      {favoriteItems.length > 0 && (
        <StatsBar
          total={stats.total}
          news={stats.news}
          movies={stats.movies}
          social={stats.social}
          onClear={handleClearAll}
        />
      )}

      {/* ── Favorites Grid ── */}
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
          {favoriteItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1    }}
              exit={{
                opacity:  0,
                scale:    0.95,
                transition: { duration: 0.15 }
              }}
            >
              <ContentCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

    </div>
  )
}