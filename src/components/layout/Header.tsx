// ============================================================
//   src/components/layout/Header.tsx
//   Top navigation header
//   - Hamburger menu (mobile)
//   - Debounced search bar
//   - Dark mode toggle
//   - User avatar / account info
// ============================================================

'use client'

import { useState, useEffect }       from 'react'
import { motion, AnimatePresence }   from 'framer-motion'
import { useAppDispatch,
         useAppSelector }            from '@/store'
import { setSearchQuery,
         clearSearchQuery,
         selectSearchQuery }         from '@/store/feedSlice'
import { useDebounce }               from '@/hooks/useDebounce'
import DarkModeToggle                from '@/components/ui/DarkModeToggle'
import { cn }                        from '@/lib/utils'
import { SEARCH_DEBOUNCE_MS,
         SEARCH_MIN_LENGTH }         from '@/lib/constants'


// ─── Icons ────────────────────────────────────────────────────────────────────

function MenuIcon() {
  return (
    <svg width='22' height='22' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <line x1='3' y1='12' x2='21' y2='12'/>
      <line x1='3' y1='6'  x2='21' y2='6' />
      <line x1='3' y1='18' x2='21' y2='18'/>
    </svg>
  )
}

function SearchIcon() {
  return (
    <svg width='18' height='18' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <circle cx='11' cy='11' r='8'/>
      <line x1='21' y1='21' x2='16.65' y2='16.65'/>
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg width='16' height='16' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <circle cx='12' cy='12' r='10'/>
      <line x1='15' y1='9' x2='9' y2='15'/>
      <line x1='9' y1='9' x2='15' y2='15'/>
    </svg>
  )
}


// ─── Types ────────────────────────────────────────────────────────────────────

interface HeaderProps {
  onMenuClick: () => void
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function Header({ onMenuClick }: HeaderProps) {
  const dispatch     = useAppDispatch()
  const searchQuery  = useAppSelector(selectSearchQuery)

  // Local input value — updates immediately on keystroke
  const [inputValue, setInputValue] = useState(searchQuery)

  // Debounced value — updates 300ms after user stops typing
  const debouncedValue = useDebounce(inputValue, SEARCH_DEBOUNCE_MS)

  // Dispatch debounced value to Redux
  useEffect(() => {
    if (debouncedValue.length === 0 || debouncedValue.length >= SEARCH_MIN_LENGTH) {
      dispatch(setSearchQuery(debouncedValue))
    }
  }, [debouncedValue, dispatch])

  // Handle clear button
  const handleClear = () => {
    setInputValue('')
    dispatch(clearSearchQuery())
  }

  return (
    <header
      className='header px-4 py-3'
      role='banner'
    >
      <div className='flex items-center gap-3 max-w-full'>

        {/* ── Hamburger Menu (mobile only) ── */}
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden p-2 rounded-xl',
            'text-[var(--text-secondary)]',
            'hover:bg-[var(--bg-tertiary)]',
            'hover:text-[var(--text-primary)]',
            'transition-colors flex-shrink-0'
          )}
          aria-label='Open navigation menu'
        >
          <MenuIcon />
        </button>

        {/* ── Search Bar ── */}
        <div className='relative flex-1 max-w-xl'>
          {/* Search Icon */}
          <div className='absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none'>
            <SearchIcon />
          </div>

          {/* Input */}
          <input
            type='search'
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder='Search news, movies, posts...'
            className='search-input pr-10'
            aria-label='Search content'
            data-cy='search-bar'
          />

          {/* Clear Button */}
          <AnimatePresence>
            {inputValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1   }}
                exit={{    opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={handleClear}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  'text-[var(--text-muted)]',
                  'hover:text-[var(--text-primary)]',
                  'transition-colors'
                )}
                aria-label='Clear search'
              >
                <ClearIcon />
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* ── Right Side Actions ── */}
        <div className='flex items-center gap-1 flex-shrink-0'>

          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* User Avatar */}
          <div
            className={cn(
              'w-8 h-8 rounded-full',
              'bg-brand-500 flex items-center justify-center',
              'text-white font-semibold text-sm',
              'cursor-pointer select-none',
              'hover:bg-brand-600 transition-colors',
              'ml-1'
            )}
            role='button'
            aria-label='User account'
            title='Account'
          >
            U
          </div>
        </div>
      </div>

      {/* ── Active Search Indicator ── */}
      <AnimatePresence>
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y:  0 }}
            exit={{    opacity: 0, y: -4 }}
            className='mt-2 px-1'
          >
            <p className='text-sm text-[var(--text-muted)]'>
              Searching for{' '}
              <span className='font-medium text-brand-500'>
                "{searchQuery}"
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}