// ============================================================
//   src/app/layout.tsx — FIXED VERSION
// ============================================================

import type { Metadata, Viewport } from 'next'
import { Inter }                   from 'next/font/google'
import Providers                   from '@/app/providers'
import '@/styles/globals.css'


// ─── Font ─────────────────────────────────────────────────────────────────────

const inter = Inter({
  subsets:  ['latin'],
  variable: '--font-inter',
  display:  'swap',
})


// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:  'ContentDash — Personalized Content Dashboard',
    template: '%s | ContentDash',
  },
  description:
    'A personalized dashboard for news, movie recommendations, and social media posts.',
  keywords: ['news', 'movies', 'social media', 'dashboard', 'personalized feed'],
  authors:  [{ name: 'ContentDash' }],
  // ── REMOVED manifest.json reference (was causing 404) ──
  icons: {
    icon: '/favicon.ico',
  },
}


// ─── Viewport ─────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)',  color: '#0f172a' },
  ],
}


// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang='en'
      className={inter.variable}
      suppressHydrationWarning
    >
      <body className='bg-[var(--bg-primary)] text-[var(--text-primary)]'>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}