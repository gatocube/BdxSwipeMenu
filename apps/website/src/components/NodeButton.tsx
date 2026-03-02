'use client'

import React from 'react'
import { GLOW_NIGHT_THEME, LIGHT_THEME } from '@bdx/swipe-menu'
import { btnStyle, NodeButtonContent } from '@/swipeMenu/ui'
import { renderMenuIcon } from '@/swipeMenu/ui'
import { useTheme } from './ThemeContext'

export interface NodeButtonProps {
    icon?: string
    label: string
    color: string
    size?: number
    active?: boolean
    dimmed?: boolean
    testId?: string
    style?: React.CSSProperties
    className?: string
}

export function NodeButton({ icon, label, color, size = 56, active, dimmed, testId, style, className }: NodeButtonProps) {
    const { theme } = useTheme()
    const t = theme === 'light' ? LIGHT_THEME : GLOW_NIGHT_THEME
    const iconSize = dimmed ? (size <= 44 ? 16 : 20) : (size <= 44 ? 18 : 24)
    const iconColor = dimmed ? t.dimmedColor : color
    const iconElement = icon ? renderMenuIcon(icon, { size: iconSize, color: iconColor }) : null

    return (
        <div
            data-testid={testId}
            className={className}
            style={{
                ...btnStyle(t, color, size, !!dimmed),
                ...(active ? { borderColor: `${color}aa`, boxShadow: `0 10px 26px rgba(0,0,0,0.55), 0 0 18px ${color}44` } : {}),
                ...style,
            }}
        >
            <NodeButtonContent iconElement={iconElement} label={label} color={color} size={size} dimmed={!!dimmed} dimmedColor={t.dimmedColor} />
        </div>
    )
}
