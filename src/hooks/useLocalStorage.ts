// ============================================================
//   src/hooks/useLocalStorage.ts
//   Works exactly like useState but syncs to localStorage
//   Value persists across page reloads automatically
//
//   Example:
//   const [theme, setTheme] = useLocalStorage('theme', 'light')
//   setTheme('dark') → saved to localStorage instantly
//   Page reload → theme is still 'dark' ✅
// ============================================================

import { useState, useEffect, useCallback } from 'react'


// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useLocalStorage<T>(
  key:          string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {

  // ── Initialize state ────────────────────────────────────────────────────
  // Read from localStorage on first render
  // Falls back to initialValue if nothing saved
  const [storedValue, setStoredValue] = useState<T>(() => {
    // localStorage not available during SSR
    if (typeof window === 'undefined') return initialValue

    try {
      const item = localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : initialValue
    } catch (error) {
      console.warn(`[useLocalStorage] Error reading key "${key}":`, error)
      return initialValue
    }
  })

  // ── Set value ────────────────────────────────────────────────────────────
  // Works like setState but also saves to localStorage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        // Support functional updates like setState
        // e.g. setValue(prev => [...prev, newItem])
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)

        if (typeof window !== 'undefined') {
          localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`[useLocalStorage] Error setting key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // ── Remove value ─────────────────────────────────────────────────────────
  // Clears the key from localStorage and resets to initialValue
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn(`[useLocalStorage] Error removing key "${key}":`, error)
    }
  }, [key, initialValue])

  // ── Sync across tabs ─────────────────────────────────────────────────────
  // If the same key is updated in another browser tab
  // this hook will update its state to match
  useEffect(() => {
    if (typeof window === 'undefined') return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T)
        } catch {
          // ignore parse errors from other tabs
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [key])

  return [storedValue, setValue, removeValue]
}

export default useLocalStorage