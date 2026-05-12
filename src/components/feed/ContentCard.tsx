// ============================================================
//   src/components/feed/ContentCard.tsx
//   The main content card — renders differently based on type
//   - NewsCard    → news articles
//   - MovieCard   → movie recommendations
//   - SocialCard  → social media posts
//
//   Usage:
//   <ContentCard item={newsArticle} />
//   <ContentCard item={movie} />
//   <ContentCard item={socialPost} />
// ============================================================

'use client'

import Image                       from 'next/image'
import { motion }                  from 'framer-motion'
import { useAppDispatch,
         useAppSelector }          from '@/store'
import { toggleFavorite }          from '@/store/favoritesSlice'
import { selectIsFavorited }       from '@/store/favoritesSlice'
import { cn }                      from '@/lib/utils'
import {
  getImageUrl,
  getCardSubtitle,
  getCtaLabel,
  formatNumber,
  truncate,
}                                  from '@/lib/utils'
import type { ContentItem }        from '@/types'


// ─── Heart Icon ───────────────────────────────────────────────────────────────

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width='18' height='18' viewBox='0 0 24 24'
      fill={filled ? 'currentColor' : 'none'}
      stroke='currentColor' strokeWidth='2'
      strokeLinecap='round' strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
    </svg>
  )
}


// ─── Type Badge ───────────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ContentItem['type'] }) {
  const config = {
    news:   { label: '📰 News',   color: 'bg-blue-100   text-blue-700   dark:bg-blue-900/30   dark:text-blue-300'   },
    movie:  { label: '🎬 Movie',  color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' },
    social: { label: '💬 Social', color: 'bg-green-100  text-green-700  dark:bg-green-900/30  dark:text-green-300'  },
  }
  const { label, color } = config[type]

  return (
    <span className={cn(
      'inline-flex items-center px-2 py-0.5',
      'rounded-full text-xs font-medium',
      color
    )}>
      {label}
    </span>
  )
}


// ─── Favorite Button ──────────────────────────────────────────────────────────

function FavoriteButton({ id, isFav }: { id: string; isFav: boolean }) {
  const dispatch = useAppDispatch()

  return (
    <motion.button
      whileTap={{ scale: 0.85 }}
      onClick={(e) => {
        e.stopPropagation()
        dispatch(toggleFavorite(id))
      }}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      aria-pressed={isFav}
      className={cn(
        'p-2 rounded-full transition-colors',
        isFav
          ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
          : 'text-[var(--text-muted)] hover:bg-[var(--bg-tertiary)] hover:text-red-400'
      )}
    >
      <HeartIcon filled={isFav} />
    </motion.button>
  )
}


// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({ item }: { item: Extract<ContentItem, { type: 'news' }> }) {
  return (
    <>
      {/* Image */}
      <div className='relative h-48 w-full overflow-hidden bg-[var(--bg-tertiary)]'>
        <Image
          src={item.imageUrl || '/placeholder-news.jpg'}
          alt={item.title}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=News'
          }}
        />
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col gap-3'>
        <TypeBadge type='news' />

        <h3 className='font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2'>
          {item.title}
        </h3>

        <p className='text-xs text-[var(--text-secondary)] line-clamp-2'>
          {item.description}
        </p>

        <div className='flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-primary)]'>
          <span className='text-xs text-[var(--text-muted)]'>
            {getCardSubtitle(item)}
          </span>
          <a
            href={item.url}
            target='_blank'
            rel='noopener noreferrer'
            className='btn-primary text-xs px-3 py-1.5'
            onClick={(e) => e.stopPropagation()}
          >
            {getCtaLabel('news')}
          </a>
        </div>
      </div>
    </>
  )
}


// ─── Movie Card ───────────────────────────────────────────────────────────────

function MovieCard({ item }: { item: Extract<ContentItem, { type: 'movie' }> }) {
  return (
    <>
      {/* Poster */}
      <div className='relative h-48 w-full overflow-hidden bg-[var(--bg-tertiary)]'>
        <Image
          src={item.imageUrl || '/placeholder-movie.jpg'}
          alt={item.title}
          fill
          className='object-cover transition-transform duration-300 group-hover:scale-105'
          sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Movie'
          }}
        />
        {/* Rating Badge */}
        <div className='absolute top-2 right-2 bg-black/70 text-yellow-400 text-xs font-bold px-2 py-1 rounded-lg'>
          ⭐ {item.rating}
        </div>
      </div>

      {/* Content */}
      <div className='p-4 flex flex-col gap-3'>
        <TypeBadge type='movie' />

        <h3 className='font-semibold text-[var(--text-primary)] text-sm leading-snug line-clamp-2'>
          {item.title}
        </h3>

        <p className='text-xs text-[var(--text-secondary)] line-clamp-2'>
          {item.description}
        </p>

        {/* Genres */}
        {item.genres.length > 0 && (
          <div className='flex flex-wrap gap-1'>
            {item.genres.slice(0, 3).map(genre => (
              <span
                key={genre}
                className='text-xs px-2 py-0.5 rounded-full bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
              >
                {genre}
              </span>
            ))}
          </div>
        )}

        <div className='flex items-center justify-between mt-auto pt-2 border-t border-[var(--border-primary)]'>
          <span className='text-xs text-[var(--text-muted)]'>
            {getCardSubtitle(item)}
          </span>
          <button className='btn-primary text-xs px-3 py-1.5'>
            {getCtaLabel('movie')}
          </button>
        </div>
      </div>
    </>
  )
}


// ─── Social Card ──────────────────────────────────────────────────────────────

function SocialCard({ item }: { item: Extract<ContentItem, { type: 'social' }> }) {
  return (
    <div className='p-4 flex flex-col gap-3'>

      {/* Author */}
      <div className='flex items-center gap-2'>
        <div className='relative w-8 h-8 rounded-full overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0'>
          {item.author.avatarUrl ? (
            <Image
              src={item.author.avatarUrl}
              alt={item.author.name}
              fill
              className='object-cover'
              sizes='32px'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center text-xs font-bold text-[var(--text-muted)]'>
              {item.author.name.charAt(0)}
            </div>
          )}
        </div>
        <div className='min-w-0'>
          <p className='text-sm font-semibold text-[var(--text-primary)] truncate'>
            {item.author.name}
          </p>
          <p className='text-xs text-[var(--text-muted)] truncate'>
            @{item.author.username}
          </p>
        </div>
        <TypeBadge type='social' />
      </div>

      {/* Post content */}
      <p className='text-sm text-[var(--text-secondary)] leading-relaxed'>
        {truncate(item.content, 180)}
      </p>

      {/* Image */}
      {item.imageUrl && (
        <div className='relative h-40 w-full overflow-hidden rounded-xl bg-[var(--bg-tertiary)]'>
          <Image
            src={item.imageUrl}
            alt='Post image'
            fill
            className='object-cover'
            sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
          />
        </div>
      )}

      {/* Hashtags */}
      {item.hashtags.length > 0 && (
        <div className='flex flex-wrap gap-1'>
          {item.hashtags.slice(0, 4).map(tag => (
            <span
              key={tag}
              className='text-xs text-brand-500 hover:text-brand-600 cursor-pointer'
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Engagement stats */}
      <div className='flex items-center gap-4 pt-2 border-t border-[var(--border-primary)]'>
        <span className='text-xs text-[var(--text-muted)]'>
          ❤️ {formatNumber(item.likes)}
        </span>
        <span className='text-xs text-[var(--text-muted)]'>
          💬 {formatNumber(item.comments)}
        </span>
        <span className='text-xs text-[var(--text-muted)]'>
          🔁 {formatNumber(item.shares)}
        </span>
        <span className='text-xs text-[var(--text-muted)] ml-auto'>
          {getCardSubtitle(item)}
        </span>
      </div>
    </div>
  )
}


// ─── Main ContentCard ─────────────────────────────────────────────────────────

interface ContentCardProps {
  item:       ContentItem
  className?: string
}

export default function ContentCard({ item, className }: ContentCardProps) {
  const isFav = useAppSelector(
    state => selectIsFavorited(state, item.id)
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0  }}
      exit={{    opacity: 0, y: -8 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'content-card group relative',
        'flex flex-col',
        className
      )}
      data-cy='content-card'
      data-id={item.id}
      data-type={item.type}
    >
      {/* ── Favorite Button (top right) ── */}
      <div className='absolute top-2 left-2 z-10'>
        <FavoriteButton id={item.id} isFav={isFav} />
      </div>

      {/* ── Card Content by Type ── */}
      {item.type === 'news'   && <NewsCard   item={item} />}
      {item.type === 'movie'  && <MovieCard  item={item} />}
      {item.type === 'social' && <SocialCard item={item} />}
    </motion.div>
  )
}