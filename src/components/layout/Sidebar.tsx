// ============================================================
//   src/components/layout/Sidebar.tsx
//   Left sidebar with navigation links
//   - Fixed position on desktop
//   - Slides in/out on mobile
//   - Shows favorites count badge
//   - Highlights active section
// ============================================================

'use client'

import Link                          from 'next/link'
import { usePathname }               from 'next/navigation'
import { motion, AnimatePresence }   from 'framer-motion'
import { useAppSelector }            from '@/store'
import { selectFavoritesCount }      from '@/store/favoritesSlice'
import { cn }                        from '@/lib/utils'
import { APP_NAME }                  from '@/lib/constants'


// ─── Icons ────────────────────────────────────────────────────────────────────

function HomeIcon()     {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <path d='M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z'/>
      <polyline points='9 22 9 12 15 12 15 22'/>
    </svg>
  )
}

function TrendingIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <polyline points='23 6 13.5 15.5 8.5 10.5 1 18'/>
      <polyline points='17 6 23 6 23 12'/>
    </svg>
  )
}

function HeartIcon()    {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <path d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <circle cx='12' cy='12' r='3'/>
      <path d='M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z'/>
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width='20' height='20' viewBox='0 0 24 24' fill='none'
      stroke='currentColor' strokeWidth='2' strokeLinecap='round'
      strokeLinejoin='round' aria-hidden='true'>
      <line x1='18' y1='6' x2='6' y2='18'/>
      <line x1='6' y1='6' x2='18' y2='18'/>
    </svg>
  )
}


// ─── Nav Links Config ─────────────────────────────────────────────────────────

const NAV_LINKS = [
  { href: '/',          label: 'Feed',      icon: HomeIcon     },
  { href: '/trending',  label: 'Trending',  icon: TrendingIcon },
  { href: '/favorites', label: 'Favorites', icon: HeartIcon    },
  { href: '/settings',  label: 'Settings',  icon: SettingsIcon },
]


// ─── Types ────────────────────────────────────────────────────────────────────

interface SidebarProps {
  isOpen:   boolean
  onClose:  () => void
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname       = usePathname()
  const favoritesCount = useAppSelector(selectFavoritesCount)

  return (
    <>
      {/* ── Mobile Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key='overlay'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{    opacity: 0 }}
            transition={{ duration: 0.2 }}
            className='fixed inset-0 bg-black/50 z-30 lg:hidden'
            onClick={onClose}
            aria-hidden='true'
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar Panel ── */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : '-100%',
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className={cn(
          // Base styles
          'sidebar z-40',
          // Desktop — always visible
          'lg:translate-x-0',
          // Mobile — controlled by isOpen
          'fixed top-0 left-0',
        )}
        aria-label='Main navigation'
      >
        {/* ── Header ── */}
        <div className='flex items-center justify-between p-6 border-b border-[var(--border-primary)]'>
          {/* Logo + App Name */}
          <Link
            href='/'
            className='flex items-center gap-2 group'
            onClick={onClose}
          >
            <div className={cn(
              'w-8 h-8 rounded-lg',
              'bg-brand-500 flex items-center justify-center',
              'text-white font-bold text-sm',
              'group-hover:bg-brand-600 transition-colors'
            )}>
              C
            </div>
            <span className='font-bold text-lg text-[var(--text-primary)]'>
              {APP_NAME}
            </span>
          </Link>

          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            className='lg:hidden p-1 rounded-lg hover:bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
            aria-label='Close navigation'
          >
            <CloseIcon />
          </button>
        </div>

        {/* ── Navigation Links ── */}
        <nav className='p-3 space-y-1' role='navigation'>
          <p className='px-3 py-2 text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider'>
            Menu
          </p>

          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'nav-link',
                  isActive && 'active'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Icon */}
                <span className='flex-shrink-0'>
                  <Icon />
                </span>

                {/* Label */}
                <span className='flex-1'>{label}</span>

                {/* Favorites count badge */}
                {label === 'Favorites' && favoritesCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn(
                      'ml-auto px-2 py-0.5 rounded-full text-xs font-semibold',
                      isActive
                        ? 'bg-brand-500 text-white'
                        : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)]'
                    )}
                  >
                    {favoritesCount}
                  </motion.span>
                )}
              </Link>
            )
          })}
        </nav>

        {/* ── Footer ── */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-[var(--border-primary)]'>
          <p className='text-xs text-[var(--text-muted)] text-center'>
            © 2024 {APP_NAME}
          </p>
        </div>
      </motion.aside>
    </>
  )
}