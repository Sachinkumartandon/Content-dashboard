// ============================================================
//   src/hooks/useDebounce.ts
//   Debounces a value by a given delay
//   Used in SearchBar to avoid API calls on every keystroke
//
//   Example:
//   const debouncedQuery = useDebounce(searchQuery, 300)
//   useEffect(() => {
//     // only fires 300ms after user stops typing
//     fetchResults(debouncedQuery)
//   }, [debouncedQuery])
// ============================================================

import { useState, useEffect } from 'react'


// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useDebounce<T>(value: T, delay: number = 300): T {
  // Store the debounced value in state
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // Start a timer to update debounced value after delay
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // Cleanup — cancel the timer if value changes before delay
    // This is what makes it a "debounce" — resets on every keystroke
    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce