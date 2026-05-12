// ============================================================
//   src/hooks/useInfiniteScroll.ts
//   Infinite scroll using IntersectionObserver API
//   Fires a callback when a sentinel element enters the viewport
//
//   How to use:
//   1. Attach sentinelRef to a div at the bottom of your list
//   2. Pass fetchNextPage as the callback
//   3. Pass hasNextPage to stop loading when no more pages
//
//   Example:
//   const { sentinelRef, isFetching } = useInfiniteScroll({
//     onIntersect: fetchNextPage,
//     hasNextPage,
//     isLoading,
//   })
//   ...
//   <div ref={sentinelRef} /> ← place at bottom of list
// ============================================================

import { useRef, useEffect, useCallback, useState } from 'react'


// ─── Types ────────────────────────────────────────────────────────────────────

interface UseInfiniteScrollOptions {
  onIntersect:  () => void   // called when sentinel enters viewport
  hasNextPage:  boolean      // false = no more pages to load
  isLoading:    boolean      // true = currently fetching
  threshold?:   number       // 0-1, how much of sentinel must be visible
  rootMargin?:  string       // margin around root e.g. "100px"
}

interface UseInfiniteScrollReturn {
  sentinelRef: React.RefObject<HTMLDivElement>
  isFetching:  boolean
}


// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useInfiniteScroll({
  onIntersect,
  hasNextPage,
  isLoading,
  threshold  = 0.1,      // fire when 10% of sentinel is visible
  rootMargin = '100px',  // fire 100px before sentinel reaches viewport
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {

  // Ref attached to the sentinel div at bottom of list
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isFetching, setIsFetching] = useState(false)

  // Stable callback reference to avoid re-creating observer
  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries

      // Only fire if:
      // 1. Sentinel is visible in viewport
      // 2. There are more pages to load
      // 3. Not currently loading
      if (entry.isIntersecting && hasNextPage && !isLoading) {
        setIsFetching(true)
        onIntersect()
      }
    },
    [onIntersect, hasNextPage, isLoading]
  )

  useEffect(() => {
    // Reset fetching state when loading completes
    if (!isLoading) {
      setIsFetching(false)
    }
  }, [isLoading])

  useEffect(() => {
    const sentinel = sentinelRef.current

    // IntersectionObserver not available in SSR
    if (!sentinel || typeof IntersectionObserver === 'undefined') return

    // Create observer
    const observer = new IntersectionObserver(handleIntersect, {
      root:       null,       // use viewport as root
      rootMargin,             // fire before element reaches viewport
      threshold,              // visibility threshold
    })

    // Start observing the sentinel element
    observer.observe(sentinel)

    // Cleanup — disconnect observer when component unmounts
    return () => {
      observer.disconnect()
    }
  }, [handleIntersect, rootMargin, threshold])

  return { sentinelRef, isFetching }
}

export default useInfiniteScroll