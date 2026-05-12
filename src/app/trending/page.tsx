// ============================================================
//   src/app/trending/page.tsx
//   Trending Page — route: /trending
//   Shows top trending content across all categories
// ============================================================

import DashboardLayout   from '@/components/layout/DashboardLayout'
import TrendingSection   from '@/components/trending/TrendingSection'
import type { Metadata } from 'next'


// ─── Page Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Trending',
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TrendingPage() {
  return (
    <DashboardLayout>
      <TrendingSection />
    </DashboardLayout>
  )
}