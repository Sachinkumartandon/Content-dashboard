// ============================================================
//   src/components/ui/DarkModeToggle.tsx
//   Animated dark/light mode toggle button
//   Reads and updates darkMode from Redux preferences slice
//
//   Usage:
//   <DarkModeToggle />              ← icon only
//   <DarkModeToggle showLabel />    ← icon + label
// ============================================================

'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useAppSelector, useAppDispatch } from '@/store'
import { selectDarkMode, toggleDarkMode } from '@/store/preferencesSlice'
import { cn } from '@/lib/utils'


// ─── Icons ────────────────────────────────────────────────────────────────────

function SunIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <circle cx='12' cy='12' r='4' />
      <path d='M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41' />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='18'
      height='18'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
      aria-hidden='true'
    >
      <path d='M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' />
    </svg>
  )
}


// ─── Types ────────────────────────────────────────────────────────────────────

interface DarkModeToggleProps {
  showLabel?: boolean
  className?: string
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function DarkModeToggle({
  showLabel = false,
  className,
}: DarkModeToggleProps) {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector(selectDarkMode)

  const handleToggle = () => {
    dispatch(toggleDarkMode())
  }

  return (
    <button
      onClick={handleToggle}
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={darkMode}
      title={darkMode ? 'Light mode' : 'Dark mode'}
      className={cn(
        // Base styles
        'relative flex items-center gap-2',
        'px-3 py-2 rounded-xl',
        'text-[var(--text-secondary)]',
        'transition-colors duration-200',
        // Hover
        'hover:bg-[var(--bg-tertiary)]',
        'hover:text-[var(--text-primary)]',
        className
      )}
    >
      {/* ── Animated Icon ── */}
      <div className='relative w-5 h-5 flex items-center justify-center'>
        <AnimatePresence mode='wait' initial={false}>
          {darkMode ? (
            // Sun icon — shown in dark mode (click to go light)
            <motion.div
              key='sun'
              initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
              animate={{ rotate: 0,   opacity: 1, scale: 1   }}
              exit={{    rotate:  90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className='absolute text-amber-400'
            >
              <SunIcon />
            </motion.div>
          ) : (
            // Moon icon — shown in light mode (click to go dark)
            <motion.div
              key='moon'
              initial={{ rotate:  90, opacity: 0, scale: 0.5 }}
              animate={{ rotate:  0,  opacity: 1, scale: 1   }}
              exit={{    rotate: -90, opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className='absolute text-slate-600'
            >
              <MoonIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Optional Label ── */}
      {showLabel && (
        <span className='text-sm font-medium select-none'>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </span>
      )}
    </button>
  )
}