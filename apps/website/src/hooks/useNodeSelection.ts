'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import type { BdxSwipeMenuActivation } from '@bdx/swipe-menu'

/**
 * Shared hook for managing which node is "selected" in a demo page.
 *
 * Handles activation-mode logic:
 *  - click → toggle on click
 *  - hold  → select after 500 ms long-press (document-level)
 *  - swipe → select on hover / touch-start (document-level)
 *
 * Returns selection state + per-node event creators for DemoNode.
 */
export function useNodeSelection(mode: BdxSwipeMenuActivation) {
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // ── Per-node callbacks (pass to DemoNode) ──────────────────────────────
    const select = useCallback((id: string) => {
        setSelectedId(prev => (prev === id ? null : id))
    }, [])

    const hover = useCallback((id: string) => {
        if (mode === 'swipe') setSelectedId(id)
    }, [mode])

    const hold = useCallback((id: string) => {
        if (mode === 'hold') setSelectedId(id)
    }, [mode])

    const touchSelect = useCallback((id: string) => {
        if (mode === 'swipe') setSelectedId(id)
    }, [mode])

    const dismiss = useCallback(() => setSelectedId(null), [])

    // ── Document-level listeners (hold timer + swipe detection) ────────────
    useEffect(() => {
        function findNodeId(target: EventTarget | null): string | null {
            const el = (target as HTMLElement)?.closest?.('[data-id]')
            return el?.getAttribute('data-id') ?? null
        }

        function findNodeIdFromPoint(x: number, y: number): string | null {
            const el = document.elementFromPoint(x, y) as HTMLElement | null
            return el?.closest?.('[data-id]')?.getAttribute('data-id') ?? null
        }

        function handleDown(nodeId: string | null) {
            if (!nodeId) return
            if (mode === 'swipe') setSelectedId(nodeId)
            if (mode === 'hold') {
                holdTimerRef.current = setTimeout(() => {
                    setSelectedId(nodeId)
                    holdTimerRef.current = null
                }, 500)
            }
        }

        function handleUp() {
            if (holdTimerRef.current) {
                clearTimeout(holdTimerRef.current)
                holdTimerRef.current = null
            }
        }

        const handlePointerDown = (e: PointerEvent) => handleDown(findNodeId(e.target))
        const handleTouchStart = (e: TouchEvent) => {
            const t = e.touches[0]
            if (t) handleDown(findNodeIdFromPoint(t.clientX, t.clientY))
        }

        document.addEventListener('pointerdown', handlePointerDown)
        document.addEventListener('pointerup', handleUp)
        document.addEventListener('pointercancel', handleUp)
        document.addEventListener('touchstart', handleTouchStart, { passive: true })
        document.addEventListener('touchend', handleUp, { passive: true })
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown)
            document.removeEventListener('pointerup', handleUp)
            document.removeEventListener('pointercancel', handleUp)
            document.removeEventListener('touchstart', handleTouchStart)
            document.removeEventListener('touchend', handleUp)
            if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
        }
    }, [mode])

    return { selectedId, setSelectedId, select, hover, hold, touchSelect, dismiss }
}
