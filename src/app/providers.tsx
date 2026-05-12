// ============================================================
//   src/app/providers.tsx — FIXED VERSION
// ============================================================

'use client'

import { useEffect }         from 'react'
import { Provider }          from 'react-redux'
import { PersistGate }       from 'redux-persist/integration/react'
import { DndProvider }       from 'react-dnd'
import { HTML5Backend }      from 'react-dnd-html5-backend'
import { store, persistor }  from '@/store'
import { useAppSelector,
         useAppDispatch }    from '@/store'
import { selectDarkMode,
         setDarkMode }       from '@/store/preferencesSlice'
import Spinner               from '@/components/ui/Spinner'


// ─── Theme Initializer ────────────────────────────────────────────────────────

function ThemeInitializer() {
  const darkMode = useAppSelector(selectDarkMode)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      document.documentElement.removeAttribute('data-theme')
    }
  }, [darkMode])

  useEffect(() => {
    const savedPreference = localStorage.getItem('contentdash_preferences')
    if (!savedPreference) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) {
        dispatch(setDarkMode(true))
      }
    }
  }, [dispatch])

  return null
}


// ─── Loading Fallback ─────────────────────────────────────────────────────────

function PersistLoading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f8fafc',
    }}>
      <div style={{ textAlign: 'center' }}>
        <Spinner size='lg' />
        <p style={{ marginTop: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
          Loading ContentDash...
        </p>
      </div>
    </div>
  )
}


// ─── Main Providers ───────────────────────────────────────────────────────────

interface ProvidersProps {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoading />} persistor={persistor}>
        <DndProvider backend={HTML5Backend}>
          <ThemeInitializer />
          {children}
        </DndProvider>
      </PersistGate>
    </Provider>
  )
}