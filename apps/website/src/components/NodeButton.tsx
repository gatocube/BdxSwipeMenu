'use client'

import React from 'react'
import { btnStyle, resolveIcon, NodeButtonContent } from '@/swipeMenu/ui'

// ── Types ────────────────────────────────────────────────────────────────────

export interface NodeButtonProps {
    /** Lucide icon name */
    icon?: string
    /** Button label */
    label: string
    /** Resolved hex color */
    color: string
    /** Button size in px */
    size?: number
    /** Whether this node is active (expanded) */
    active?: boolean
    /** Whether this node is dimmed (not in active path) */
    dimmed?: boolean
    /** Test ID for e2e selection */
    testId?: string
    /** Additional inline style overrides */
    style?: React.CSSProperties
    /** Additional class names */
    className?: string
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * Shared visual rendering of a menu node button.
 * Used by the MenuConfigurator tiles and anywhere a static node preview is needed.
 * Uses the same `btnStyle` and `NodeButtonContent` as MotionButton in BdxSwipeMenu.
 */
export function NodeButton({ icon, label, color, size = 56, active, dimmed, testId, style, className }: NodeButtonProps) {
    const Icon = resolveIcon(icon)

    return (
        <div
            data-testid={testId}
            className={className}
            style={{
                ...btnStyle(color, size, !!dimmed),
                ...(active ? { borderColor: `${color}aa`, boxShadow: `0 10px 26px rgba(0,0,0,0.55), 0 0 18px ${color}44` } : {}),
                ...style,
            }}
        >
            <NodeButtonContent icon={Icon} label={label} color={color} size={size} dimmed={!!dimmed} />
        </div>
    )
}
