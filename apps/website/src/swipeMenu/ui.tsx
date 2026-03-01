'use client'

import type { MenuNode } from '@bdx/swipe-menu'
import type { LucideIcon } from 'lucide-react'
import {
    Plus,
    Settings,
    Cpu,
    Code,
    UserCircle,
    Trash2,
    FileCode,
    Terminal,
    FileType,
    Brain,
    Wrench,
    Search,
    Paperclip,
    Clock,
    StickyNote,
    Briefcase,
    ClipboardCheck,
    Workflow,
    Pencil,
    MessageSquareText,
    GitPullRequest,
    AlertTriangle,
    BadgeCheck,
    Link,
    Menu,
    SlidersHorizontal,
} from 'lucide-react'

export const BTN_SIZE = 56

export const AUTO_COLORS = [
    '#22d3ee', // cyan
    '#a78bfa', // violet
    '#34d399', // emerald
    '#fb923c', // orange
    '#f472b6', // pink
    '#facc15', // yellow
    '#60a5fa', // blue
    '#fb7185', // rose
    '#4ade80', // green
    '#c084fc', // purple
]

export function resolveColor(node: MenuNode, index: number): string {
    return node.color || AUTO_COLORS[index % AUTO_COLORS.length]
}

export const ICON_MAP: Record<string, LucideIcon> = {
    plus: Plus,
    settings: Settings,
    cpu: Cpu,
    code: Code,
    'user-circle': UserCircle,
    'trash-2': Trash2,
    'file-code': FileCode,
    terminal: Terminal,
    'file-type': FileType,
    brain: Brain,
    wrench: Wrench,
    search: Search,
    paperclip: Paperclip,
    clock: Clock,
    'sticky-note': StickyNote,
    briefcase: Briefcase,
    'clipboard-check': ClipboardCheck,
    workflow: Workflow,
    pencil: Pencil,
    'message-square-text': MessageSquareText,
    'git-pull-request': GitPullRequest,
    'alert-triangle': AlertTriangle,
    'badge-check': BadgeCheck,
    link: Link,
    menu: Menu,
    'sliders-horizontal': SlidersHorizontal,
    'file-text': FileCode,
}

export function resolveIcon(name?: string): LucideIcon | undefined {
    if (!name) return undefined
    return ICON_MAP[name] || Plus
}

export function btnStyle(color: string, size = 56, dimmed = false): React.CSSProperties {
    return {
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: size <= 44 ? 12 : 16,
        borderWidth: 1.5,
        borderStyle: 'solid',
        borderColor: dimmed ? 'rgba(148,163,184,0.25)' : `${color}44`,
        background: dimmed ? 'rgba(15,15,26,0.75)' : 'rgba(15,15,26,0.92)',
        backdropFilter: 'blur(12px)',
        color: dimmed ? '#94a3b8' : color,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        fontFamily: 'Inter',
        padding: 0,
        boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 0 1px ${color}11`,
        transition: 'border-color 0.15s, box-shadow 0.15s',
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
    }
}

export function NodeButtonContent({
    icon: Icon,
    label,
    color,
    size = 56,
    dimmed = false,
}: {
    icon?: LucideIcon
    label: string
    color: string
    size?: number
    dimmed?: boolean
}) {
    return (
        <>
            {Icon && (
                <Icon
                    size={dimmed ? (size <= 44 ? 16 : 20) : (size <= 44 ? 18 : 24)}
                    strokeWidth={2}
                    color={dimmed ? '#94a3b8' : color}
                />
            )}
            <span
                style={{
                    fontSize: Icon ? (size <= 44 ? 7 : 8) : (size <= 44 ? 9 : 10),
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: 0.3,
                    lineHeight: 1,
                    opacity: dimmed ? 0.85 : 0.9,
                    color: dimmed ? '#94a3b8' : undefined,
                    maxWidth: '90%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                }}
            >
                {label}
            </span>
        </>
    )
}
