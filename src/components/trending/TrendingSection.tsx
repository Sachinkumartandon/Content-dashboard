// ============================================================
//   src/components/trending/TrendingSection.tsx
//   Shows top trending content across all categories
//   - Trending News
//   - Trending Movies
//   - Trending Social Posts
//   - Category tabs to filter
// ============================================================

'use client'

import { useState }                  from 'react'
import Image                         from 'next/image'
import { motion, AnimatePresence }   from 'framer-motion'
import { useAppDispatch,
         useAppSelector }            from '@/store'
import { toggleFavorite }            from '@/store/favoritesSlice'
import { selectIsFavorited }         from '@/store/favoritesSlice'
import {
  useFetchTrendingMoviesQuery,
  useFetchTrendingSocialQuery,
}                                    from '@/store/contentApi'
import { TrendingCardSkeleton }      from '@/components/ui/Skeleton'
import { cn }                        from '@/lib/utils'
import {
  timeAgo,
  formatNumber,
  truncate,
}                                    from '@/lib/utils'
import { mockNews }                  from '@/lib/mockData'
import type { ContentItem }          from '@/types'


// ─── Tab Config ───────────────────────────────────────────────────────────────

const TABS = [
  { id: 'all',    label: 'All',    emoji: '🔥' },
  { id: 'news',   label: 'News',   emoji: '📰' },
  { id: 'movies', label: 'Movies', emoji: '🎬' },
  { id: 'social', label: 'Social', emoji: '💬' },
] as const

type TabId = typeof TABS[number]['id']


// ─── Trending Card ────────────────────────────────────────────────────────────

function TrendingCard({
  item,
  rank,
}: {
  item: ContentItem
  rank: number
}) {
  const dispatch = useAppDispatch()
  const isFav    = useAppSelector(
    state => selectIsFavorited(state, item.id)
  )

  const title    = item.type === 'social'
    ? truncate(item.content, 80)
    : (item as any).title

  const imageUrl = item.type === 'social'
    ? item.author.avatarUrl
    : (item as any).imageUrl

  const subtitle = item.type === 'news'
    ? `${(item as any).source} • ${timeAgo(item.publishedAt)}`
    : item.type === 'movie'
    ? `⭐ ${(item as any).rating} • ${(item as any).genres?.[0] || ''}`
    : `@${item.author.username} • ${formatNumber(item.likes)} likes`

  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0   }}
      exit={{    opacity: 0, x:  16 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex items-center gap-3 p-3',
        'rounded-xl border border-[var(--border-primary)]',
        'bg-[var(--surface-primary)]',
        'hover:border-[var(--border-secondary)]',
        'hover:shadow-sm transition-all duration-200',
        'group cursor-pointer',
      )}
    >
      {/* Rank Number */}
      <span className={cn(
        'text-lg font-bold flex-shrink-0 w-6 text-center',
        rank === 1 && 'text-yellow-500',
        rank === 2 && 'text-gray-400',
        rank === 3 && 'text-amber-600',
        rank  >  3 && 'text-[var(--text-muted)]',
      )}>
        {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
      </span>

      {/* Thumbnail */}
      <div className='relative w-14 h-14 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0'>
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
            sizes='56px'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-2xl'>
            {item.type === 'news'   ? '📰'
           : item.type === 'movie'  ? '🎬'
           :                         '💬'}
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className='flex-1 min-w-0'>
        <p className='text-sm font-medium text-[var(--text-primary)] line-clamp-2 leading-snug'>
          {title}
        </p>
        <p className='text-xs text-[var(--text-muted)] mt-1 truncate'>
          {subtitle}
        </p>
      </div>

      {/* Favorite Button */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          dispatch(toggleFavorite(item.id))
        }}
        aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
        className={cn(
          'flex-shrink-0 p-1.5 rounded-full',
          'opacity-0 group-hover:opacity-100',
          'transition-all duration-200',
          isFav
            ? 'opacity-100 text-red-500'
            : 'text-[var(--text-muted)] hover:text-red-400',
        )}
      >
        <svg width='16' height='16' viewBox='0 0 24 24'
          fill={isFav ? 'currentColor' : 'none'}
          stroke='currentColor' strokeWidth='2'
          strokeLinecap='round' strokeLinejoin='round'
        >
          <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
        </svg>
      </button>
    </motion.div>
  )
}


// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({
  emoji,
  title,
  count,
}: {
  emoji: string
  title: string
  count: number
}) {
  return (
    <div className='flex items-center justify-between mb-3'>
      <h3 className='font-semibold text-[var(--text-primary)] flex items-center gap-2'>
        <span>{emoji}</span>
        <span>{title}</span>
      </h3>
      <span className='text-xs text-[var(--text-muted)] badge'>
        {count} items
      </span>
    </div>
  )
}


// ─── Main Component ───────────────────────────────────────────────────────────

export default function TrendingSection() {
  const [activeTab, setActiveTab] = useState<TabId>('all')

  // Fetch trending movies and social posts
  const {
    data:      moviesData,
    isLoading: moviesLoading,
  } = useFetchTrendingMoviesQuery()

  const {
    data:      socialData,
    isLoading: socialLoading,
  } = useFetchTrendingSocialQuery()

  // Use mock news for trending (NewsAPI free tier doesn't support trending)
  const trendingNews   = mockNews.slice(0, 5)
  const trendingMovies = moviesData?.data?.slice(0, 5) || []
  const trendingSocial = socialData?.data?.slice(0, 5) || []

  const isLoading = moviesLoading || socialLoading

  // Filter items based on active tab
  const showNews   = activeTab === 'all' || activeTab === 'news'
  const showMovies = activeTab === 'all' || activeTab === 'movies'
  const showSocial = activeTab === 'all' || activeTab === 'social'

  return (
    <div className='space-y-6'>

      {/* ── Page Header ── */}
      <div>
        <h2 className='text-xl font-bold text-[var(--text-primary)]'>
          🔥 Trending Now
        </h2>
        <p className='text-sm text-[var(--text-muted)] mt-1'>
          Top trending content across all categories
        </p>
      </div>

      {/* ── Category Tabs ── */}
      <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide'>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-xl',
              'text-sm font-medium whitespace-nowrap',
              'transition-all duration-200 flex-shrink-0',
              activeTab === tab.id
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]'
            )}
            aria-pressed={activeTab === tab.id}
          >
            <span>{tab.emoji}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* ── Trending Content ── */}
      <AnimatePresence mode='wait'>
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8  }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className='space-y-8'
        >
          {/* ── Trending News ── */}
          {showNews && (
            <div>
              <SectionHeader
                emoji='📰'
                title='Trending News'
                count={trendingNews.length}
              />
              <div className='space-y-2'>
                {trendingNews.map((item, index) => (
                  <TrendingCard
                    key={item.id}
                    item={item}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ── Trending Movies ── */}
          {showMovies && (
            <div>
              <SectionHeader
                emoji='🎬'
                title='Trending Movies'
                count={trendingMovies.length}
              />
              <div className='space-y-2'>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TrendingCardSkeleton key={i} />
                    ))
                  : trendingMovies.map((item, index) => (
                      <TrendingCard
                        key={item.id}
                        item={item}
                        rank={index + 1}
                      />
                    ))
                }
              </div>
            </div>
          )}

          {/* ── Trending Social ── */}
          {showSocial && (
            <div>
              <SectionHeader
                emoji='💬'
                title='Trending Posts'
                count={trendingSocial.length}
              />
              <div className='space-y-2'>
                {isLoading
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TrendingCardSkeleton key={i} />
                    ))
                  : trendingSocial.map((item, index) => (
                      <TrendingCard
                        key={item.id}
                        item={item}
                        rank={index + 1}
                      />
                    ))
                }
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}