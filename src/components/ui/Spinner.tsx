// ============================================================
//   src/components/ui/Spinner.tsx
//   Animated loading spinner
//   Used when content is being fetched from APIs
//
//   Usage:
//   <Spinner />                    ← default medium size
//   <Spinner size='lg' />          ← large spinner
//   <Spinner size='sm' color='white' />  ← small white spinner
// ============================================================

import { cn } from '@/lib/utils'


// ─── Types ────────────────────────────────────────────────────────────────────

interface SpinnerProps {
  size?:      'sm' | 'md' | 'lg' | 'xl'
  color?:     'brand' | 'white' | 'gray'
  className?: string
}


// ─── Size Map ─────────────────────────────────────────────────────────────────

const sizeMap = {
  sm: 'w-4 h-4 border-2',
  md: 'w-6 h-6 border-2',
  lg: 'w-8 h-8 border-3',
  xl: 'w-12 h-12 border-4',
}


// ─── Color Map ────────────────────────────────────────────────────────────────

const colorMap = {
  brand: 'border-brand-200 border-t-brand-500',
  white: 'border-white/30 border-t-white',
  gray:  'border-gray-200 border-t-gray-500',
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function Spinner({
  size      = 'md',
  color     = 'brand',
  className,
}: SpinnerProps) {
  return (
    <div
      role='status'
      aria-label='Loading'
      className={cn(
        // Base styles
        'rounded-full animate-spin',
        // Size variant
        sizeMap[size],
        // Color variant
        colorMap[color],
        className
      )}
    />
  )
}