// ============================================================
//   src/app/settings/page.tsx
//   Settings Page — route: /settings
//   Users can configure:
//   - Content categories
//   - Dark mode
//   - Language
//   - Layout style
//   - Items per page
//   - Clear favorites
//   - Reset all preferences
// ============================================================

'use client'

import { motion }                    from 'framer-motion'
import DashboardLayout               from '@/components/layout/DashboardLayout'
import DarkModeToggle                from '@/components/ui/DarkModeToggle'
import { useAppDispatch,
         useAppSelector }            from '@/store'
import {
  selectPreferences,
  toggleCategory,
  setLanguage,
  setItemsPerPage,
  setLayout,
  resetPreferences,
}                                    from '@/store/preferencesSlice'
import {
  selectFavoritesCount,
  clearFavorites,
}                                    from '@/store/favoritesSlice'
import { cn }                        from '@/lib/utils'
import {
  CATEGORIES,
  SUPPORTED_LANGUAGES,
  ITEMS_PER_PAGE_OPTIONS,
}                                    from '@/lib/constants'



// ─── Section Wrapper ──────────────────────────────────────────────────────────

function SettingsSection({
  title,
  description,
  children,
}: {
  title:       string
  description: string
  children:    React.ReactNode
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0  }}
      className={cn(
        'p-6 rounded-2xl',
        'bg-[var(--surface-primary)]',
        'border border-[var(--border-primary)]',
        'space-y-4',
      )}
    >
      <div>
        <h3 className='font-semibold text-[var(--text-primary)] text-base'>
          {title}
        </h3>
        <p className='text-sm text-[var(--text-muted)] mt-0.5'>
          {description}
        </p>
      </div>
      {children}
    </motion.div>
  )
}


// ─── Settings Page Content ────────────────────────────────────────────────────

function SettingsContent() {
  const dispatch       = useAppDispatch()
  const preferences    = useAppSelector(selectPreferences)
  const favoritesCount = useAppSelector(selectFavoritesCount)

  // ── Handle Reset ────────────────────────────────────────────────────────
  const handleReset = () => {
    if (window.confirm(
      'Reset all preferences to defaults? This cannot be undone.'
    )) {
      dispatch(resetPreferences())
    }
  }

  // ── Handle Clear Favorites ───────────────────────────────────────────────
  const handleClearFavorites = () => {
    if (window.confirm(
      `Clear all ${favoritesCount} favorites? This cannot be undone.`
    )) {
      dispatch(clearFavorites())
    }
  }

  return (
    <div className='space-y-6 max-w-2xl'>

      {/* ── Page Header ── */}
      <div>
        <h2 className='text-xl font-bold text-[var(--text-primary)]'>
          ⚙️ Settings
        </h2>
        <p className='text-sm text-[var(--text-muted)] mt-1'>
          Customize your ContentDash experience
        </p>
      </div>

      {/* ── Content Categories ── */}
      <SettingsSection
        title='Content Categories'
        description='Select topics you want to see in your feed'
      >
        <div className='flex flex-wrap gap-2'>
          {CATEGORIES.map(({ value, label, emoji }) => {
            const isSelected = preferences.categories.includes(value)
            return (
              <button
                key={value}
                onClick={() => dispatch(toggleCategory(value))}
                aria-pressed={isSelected}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2',
                  'rounded-xl text-sm font-medium',
                  'transition-all duration-200',
                  'border',
                  isSelected
                    ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                    : [
                        'bg-[var(--bg-secondary)]',
                        'text-[var(--text-secondary)]',
                        'border-[var(--border-primary)]',
                        'hover:border-brand-300',
                        'hover:text-brand-500',
                      ]
                )}
              >
                <span>{emoji}</span>
                <span>{label}</span>
                {isSelected && (
                  <span className='text-white/80 text-xs'>✓</span>
                )}
              </button>
            )
          })}
        </div>
        <p className='text-xs text-[var(--text-muted)]'>
          {preferences.categories.length} of {CATEGORIES.length} selected
          {preferences.categories.length === 1 && (
            <span className='text-amber-500 ml-2'>
              ⚠️ Select at least 2 for a varied feed
            </span>
          )}
        </p>
      </SettingsSection>

      {/* ── Appearance ── */}
      <SettingsSection
        title='Appearance'
        description='Customize how ContentDash looks'
      >
        {/* Dark Mode */}
        <div className='flex items-center justify-between py-2'>
          <div>
            <p className='text-sm font-medium text-[var(--text-primary)]'>
              Dark Mode
            </p>
            <p className='text-xs text-[var(--text-muted)]'>
              {preferences.darkMode ? 'Dark theme is on' : 'Light theme is on'}
            </p>
          </div>
          <DarkModeToggle showLabel />
        </div>

        {/* Layout */}
        <div className='space-y-2'>
          <p className='text-sm font-medium text-[var(--text-primary)]'>
            Feed Layout
          </p>
          <div className='flex gap-3'>
            {(['grid', 'list'] as const).map((layoutOption) => (
              <button
                key={layoutOption}
                onClick={() => dispatch(setLayout(layoutOption))}
                aria-pressed={preferences.layout === layoutOption}
                className={cn(
                  'flex items-center gap-2 px-4 py-2',
                  'rounded-xl text-sm font-medium',
                  'border transition-all duration-200',
                  preferences.layout === layoutOption
                    ? 'bg-brand-500 text-white border-brand-500'
                    : [
                        'bg-[var(--bg-secondary)]',
                        'text-[var(--text-secondary)]',
                        'border-[var(--border-primary)]',
                        'hover:border-brand-300',
                      ]
                )}
              >
                <span>{layoutOption === 'grid' ? '⊞' : '☰'}</span>
                <span className='capitalize'>{layoutOption}</span>
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* ── Language ── */}
      <SettingsSection
        title='Language'
        description='Choose your preferred display language'
      >
        <div className='flex flex-wrap gap-2'>
          {SUPPORTED_LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              onClick={() => dispatch(setLanguage(code))}
              aria-pressed={preferences.language === code}
              className={cn(
                'flex items-center gap-2 px-4 py-2',
                'rounded-xl text-sm font-medium',
                'border transition-all duration-200',
                preferences.language === code
                  ? 'bg-brand-500 text-white border-brand-500'
                  : [
                      'bg-[var(--bg-secondary)]',
                      'text-[var(--text-secondary)]',
                      'border-[var(--border-primary)]',
                      'hover:border-brand-300',
                    ]
              )}
            >
              <span>{flag}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </SettingsSection>

      {/* ── Feed Settings ── */}
      <SettingsSection
        title='Feed Settings'
        description='Control how many items appear in your feed'
      >
        <div className='space-y-2'>
          <p className='text-sm font-medium text-[var(--text-primary)]'>
            Items Per Page
          </p>
          <div className='flex gap-3'>
            {ITEMS_PER_PAGE_OPTIONS.map((option) => (
              <button
                key={option}
                onClick={() => dispatch(setItemsPerPage(option))}
                aria-pressed={preferences.itemsPerPage === option}
                className={cn(
                  'px-4 py-2 rounded-xl text-sm font-medium',
                  'border transition-all duration-200',
                  preferences.itemsPerPage === option
                    ? 'bg-brand-500 text-white border-brand-500'
                    : [
                        'bg-[var(--bg-secondary)]',
                        'text-[var(--text-secondary)]',
                        'border-[var(--border-primary)]',
                        'hover:border-brand-300',
                      ]
                )}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </SettingsSection>

      {/* ── Data Management ── */}
      <SettingsSection
        title='Data Management'
        description='Manage your saved data and preferences'
      >
        <div className='space-y-3'>

          {/* Clear Favorites */}
          <div className='flex items-center justify-between py-2'>
            <div>
              <p className='text-sm font-medium text-[var(--text-primary)]'>
                Saved Favorites
              </p>
              <p className='text-xs text-[var(--text-muted)]'>
                {favoritesCount > 0
                  ? `${favoritesCount} items saved`
                  : 'No favorites saved yet'}
              </p>
            </div>
            <button
              onClick={handleClearFavorites}
              disabled={favoritesCount === 0}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'border transition-all duration-200',
                favoritesCount > 0
                  ? [
                      'border-red-300 text-red-500',
                      'hover:bg-red-50 dark:hover:bg-red-900/20',
                    ]
                  : 'border-[var(--border-primary)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
              )}
            >
              Clear Favorites
            </button>
          </div>

          <div className='h-px bg-[var(--border-primary)]' />

          {/* Reset All */}
          <div className='flex items-center justify-between py-2'>
            <div>
              <p className='text-sm font-medium text-[var(--text-primary)]'>
                Reset All Preferences
              </p>
              <p className='text-xs text-[var(--text-muted)]'>
                Restore all settings to their defaults
              </p>
            </div>
            <button
              onClick={handleReset}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium',
                'border border-[var(--border-primary)]',
                'text-[var(--text-secondary)]',
                'hover:border-red-300 hover:text-red-500',
                'transition-all duration-200',
              )}
            >
              Reset
            </button>
          </div>
        </div>
      </SettingsSection>

    </div>
  )
}


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <SettingsContent />
    </DashboardLayout>
  )
}