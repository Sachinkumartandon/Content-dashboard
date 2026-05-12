// ============================================================
//   src/app/favorites/page.tsx
//   Favorites Page — route: /favorites
//   Shows all content the user has marked as favorite
// ============================================================

import DashboardLayout   from '@/components/layout/DashboardLayout'
import FavoritesSection  from '@/components/favorites/FavoritesSection'
import type { Metadata } from 'next'


// ─── Page Metadata ────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: 'Favorites',
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FavoritesPage() {
  return (
    <DashboardLayout>
      <FavoritesSection />
    </DashboardLayout>
  )
}