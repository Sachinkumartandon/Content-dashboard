// ============================================================
//   src/components/ui/Skeleton.tsx
//   Pulsing skeleton placeholders shown while content loads
//   Prevents layout shift — same shape as real content
//
//   Usage:
//   <Skeleton className='h-4 w-3/4' />        ← text line
//   <Skeleton className='h-48 w-full' />       ← image area
//   <CardSkeleton />                           ← full card
//   <FeedSkeleton count={6} />                 ← multiple cards
// ============================================================

import { cn } from '@/lib/utils'


// ─── Base Skeleton ────────────────────────────────────────────────────────────

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'skeleton rounded-md',  // shimmer animation from globals.css
        className
      )}
      aria-hidden='true'
    />
  )
}


// ─── Card Skeleton ────────────────────────────────────────────────────────────
// Matches the shape of a ContentCard

export function CardSkeleton() {
  return (
    <div
      className={cn(
        'content-card p-0 overflow-hidden',
        'animate-fade-in'
      )}
      aria-hidden='true'
    >
      {/* Image placeholder */}
      <Skeleton className='h-48 w-full rounded-none' />

      <div className='p-4 space-y-3'>
        {/* Badge placeholder */}
        <Skeleton className='h-5 w-20' />

        {/* Title placeholder — two lines */}
        <div className='space-y-2'>
          <Skeleton className='h-4 w-full' />
          <Skeleton className='h-4 w-4/5' />
        </div>

        {/* Description placeholder — three lines */}
        <div className='space-y-2'>
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-full' />
          <Skeleton className='h-3 w-3/5' />
        </div>

        {/* Footer — source and button */}
        <div className='flex items-center justify-between pt-2'>
          <div className='flex items-center gap-2'>
            {/* Avatar */}
            <Skeleton className='h-6 w-6 rounded-full' />
            {/* Source name */}
            <Skeleton className='h-3 w-24' />
          </div>
          {/* CTA button */}
          <Skeleton className='h-8 w-24 rounded-lg' />
        </div>
      </div>
    </div>
  )
}


// ─── Feed Skeleton ────────────────────────────────────────────────────────────
// Renders multiple CardSkeletons in a grid

interface FeedSkeletonProps {
  count?: number
}

export function FeedSkeleton({ count = 6 }: FeedSkeletonProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
      {Array.from({ length: count }).map((_, index) => (
        <CardSkeleton key={index} />
      ))}
    </div>
  )
}


// ─── Trending Skeleton ────────────────────────────────────────────────────────
// Matches the shape of a TrendingCard (compact horizontal card)

export function TrendingCardSkeleton() {
  return (
    <div
      className='flex gap-3 p-3 content-card'
      aria-hidden='true'
    >
      {/* Thumbnail */}
      <Skeleton className='h-16 w-16 rounded-lg flex-shrink-0' />

      {/* Text content */}
      <div className='flex-1 space-y-2'>
        <Skeleton className='h-4 w-full' />
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  )
}


// ─── Search Result Skeleton ───────────────────────────────────────────────────

export function SearchResultSkeleton() {
  return (
    <div
      className='flex items-center gap-3 px-4 py-2'
      aria-hidden='true'
    >
      <Skeleton className='h-10 w-10 rounded-lg flex-shrink-0' />
      <div className='flex-1 space-y-1'>
        <Skeleton className='h-4 w-3/4' />
        <Skeleton className='h-3 w-1/2' />
      </div>
    </div>
  )
}


// ─── Profile Skeleton ─────────────────────────────────────────────────────────

export function ProfileSkeleton() {
  return (
    <div
      className='flex items-center gap-3 p-4'
      aria-hidden='true'
    >
      {/* Avatar */}
      <Skeleton className='h-10 w-10 rounded-full flex-shrink-0' />
      <div className='flex-1 space-y-1'>
        {/* Name */}
        <Skeleton className='h-4 w-32' />
        {/* Email */}
        <Skeleton className='h-3 w-48' />
      </div>
    </div>
  )
}


// Default export for simple usage
export default Skeleton