'use client'

import React from 'react'
import { icons, type LucideIcon } from 'lucide-react'
import { btnStyle as libBtnStyle, NodeButtonContent as LibNodeButtonContent, resolveColor as libResolveColor, BTN_SIZE as LIB_BTN_SIZE, GLOW_NIGHT_THEME, LIGHT_THEME } from '@bdx/swipe-menu'
import type { MenuNode, BdxThemeConfig } from '@bdx/swipe-menu'

function pascalToKebab(s: string): string {
    return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const allIcons: Record<string, LucideIcon> = Object.fromEntries(
    Object.entries(icons).map(([k, v]) => [pascalToKebab(k), v])
)

export const ALL_ICON_NAMES = Object.keys(allIcons)

export function resolveIcon(name?: string): LucideIcon | undefined {
    if (!name) return undefined
    return allIcons[name]
}

export function renderMenuIcon(name: string, { size, color }: { size: number; color: string }): React.ReactNode {
    const Icon = allIcons[name]
    return Icon ? React.createElement(Icon, { size, color }) : null
}

export { libBtnStyle as btnStyle, LibNodeButtonContent as NodeButtonContent, libResolveColor as resolveColor, LIB_BTN_SIZE as BTN_SIZE, GLOW_NIGHT_THEME, LIGHT_THEME }
export type { MenuNode, BdxThemeConfig }
export { allIcons }
