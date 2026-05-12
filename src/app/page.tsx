// ============================================================
//   src/app/page.tsx
//   Main Dashboard Home Page — route: /
//   Shows the personalized content feed
// ============================================================

import DashboardLayout from '@/components/layout/DashboardLayout'
import FeedContainer   from '@/components/feed/FeedContainer'
import type { Metadata } from 'next'


// ─── Page Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Feed',
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <DashboardLayout>
      <FeedContainer />
    </DashboardLayout>
  )
}