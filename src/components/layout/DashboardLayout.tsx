// ============================================================
//   src/components/layout/DashboardLayout.tsx
//   Main layout shell for the entire dashboard
//   - Fixed sidebar on desktop
//   - Slide-in sidebar on mobile
//   - Sticky header
//   - Main content area with proper margins
//
//   Structure:
//   ┌─────────────────────────────────────┐
//   │  Sidebar  │  Header                 │
//   │  (fixed)  ├─────────────────────────│
//   │           │  Main Content           │
//   │           │  (scrollable)           │
//   └─────────────────────────────────────┘
// ============================================================

'use client'

import { useState }    from 'react'
import { motion }      from 'framer-motion'
import Sidebar         from '@/components/layout/Sidebar'
import Header          from '@/components/layout/Header'
import { cn }          from '@/lib/utils'


// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: React.ReactNode
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  // Controls mobile sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className='min-h-screen bg-[var(--bg-primary)]'>

      {/* ── Sidebar ── */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main Area (shifts right on desktop to account for sidebar) ── */}
      <div
        className={cn(
          'flex flex-col min-h-screen',
          // Desktop — push content right of sidebar
          'lg:pl-[240px]',
        )}
      >

        {/* ── Sticky Header ── */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* ── Page Content ── */}
        <motion.main
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={cn(
            'flex-1',
            'px-4 sm:px-6 lg:px-8',
            'py-6',
            'max-w-7xl mx-auto w-full',
          )}
          id='main-content'
          role='main'
          aria-label='Main content'
        >
          {children}
        </motion.main>

        {/* ── Footer ── */}
        <footer
          className={cn(
            'py-4 px-8',
            'border-t border-[var(--border-primary)]',
            'text-center text-sm text-[var(--text-muted)]',
          )}
          role='contentinfo'
        >
          <p>ContentDash © 2024 — Built with Next.js & Redux Toolkit</p>
        </footer>
      </div>
    </div>
  )
}