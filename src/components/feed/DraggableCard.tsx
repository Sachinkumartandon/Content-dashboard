// ============================================================
//   src/components/feed/DraggableCard.tsx
//   Wraps ContentCard with React DnD drag and drop
//   - Drag card to reorder feed
//   - Visual feedback during drag
//   - Updates Redux state on drop
//
//   Usage:
//   <DraggableCard item={item} index={0} onMove={handleMove} />
// ============================================================

'use client'

import { useRef }              from 'react'
import { useDrag, useDrop }    from 'react-dnd'
import type { Identifier }     from 'dnd-core'
import { motion }              from 'framer-motion'
import ContentCard             from '@/components/feed/ContentCard'
import { cn }                  from '@/lib/utils'
import { DND_ITEM_TYPE }       from '@/lib/constants'
import type { ContentItem,
             DragItem }        from '@/types'


// ─── Types ────────────────────────────────────────────────────────────────────

interface DraggableCardProps {
  item:    ContentItem
  index:   number
  onMove:  (fromIndex: number, toIndex: number) => void
}


// ─── Component ────────────────────────────────────────────────────────────────

export default function DraggableCard({
  item,
  index,
  onMove,
}: DraggableCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  // ── Drop Target ────────────────────────────────────────────────────────
  // This card can receive other cards being dropped onto it
  const [{ handlerId, isOver }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: Identifier | null; isOver: boolean }
  >({
    accept: DND_ITEM_TYPE,

    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver:    monitor.isOver(),
      }
    },

    hover(draggedItem: DragItem) {
      if (!ref.current) return

      const dragIndex = draggedItem.index
      const hoverIndex = index

      // Don't replace card with itself
      if (dragIndex === hoverIndex) return

      // Move the card in Redux state
      onMove(dragIndex, hoverIndex)

      // Update the dragged item's index
      // This avoids re-triggering move while hovering
      draggedItem.index = hoverIndex
    },
  })

  // ── Drag Source ────────────────────────────────────────────────────────
  // This card can be picked up and dragged
  const [{ isDragging }, drag] = useDrag({
    type: DND_ITEM_TYPE,

    item: (): DragItem => ({
      id:    item.id,
      index,
      type:  item.type,
    }),

    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Attach both drag and drop refs to the same element
  drag(drop(ref))

  return (
    <motion.div
      ref={ref}
      data-handler-id={handlerId}
      layout
      transition={{ duration: 0.2 }}
      className={cn(
        'relative cursor-grab active:cursor-grabbing',
        // Visual feedback when being dragged
        isDragging && 'dragging',
        // Visual feedback when another card hovers over this one
        isOver && !isDragging && 'drag-over',
      )}
      aria-label={`Draggable card: ${
        item.type === 'social' ? item.content.slice(0, 50) : (item as any).title
      }`}
    >
      {/* Drag Handle Indicator */}
      <div className={cn(
        'absolute top-2 right-2 z-20',
        'opacity-0 group-hover:opacity-100',
        'transition-opacity duration-200',
        'text-[var(--text-muted)]',
        'pointer-events-none',
      )}>
        <svg
          width='16' height='16' viewBox='0 0 24 24'
          fill='currentColor' aria-hidden='true'
        >
          <circle cx='9'  cy='6'  r='1.5'/>
          <circle cx='9'  cy='12' r='1.5'/>
          <circle cx='9'  cy='18' r='1.5'/>
          <circle cx='15' cy='6'  r='1.5'/>
          <circle cx='15' cy='12' r='1.5'/>
          <circle cx='15' cy='18' r='1.5'/>
        </svg>
      </div>

      {/* The actual content card */}
      <ContentCard item={item} />
    </motion.div>
  )
}