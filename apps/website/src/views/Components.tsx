'use client'

import { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { NodeButton } from '../components/NodeButton'
import { ComingSoon } from '../components/ComingSoon'
import { CodeViewer } from '../components/CodeViewer'
import { cn } from '@/utils/utils'

import { useTheme } from '../components/ThemeContext'
import { GLOW_NIGHT_THEME, LIGHT_THEME } from '@/swipeMenu/ui'

const BTN_SIZE = 56

// ── Component definitions for the sidebar ────────────────────────────────────

interface ComponentDef {
    id: string
    label: string
    ready: boolean
}

const COMPONENTS: ComponentDef[] = [
    { id: 'bdx-button', label: 'BdxButton', ready: true },
    { id: 'bdx-card', label: 'BdxCard', ready: false },
]

// ── Sample buttons to showcase ───────────────────────────────────────────────

interface SampleButton {
    icon?: string
    label: string
    color: string
    size?: number
    dimmed?: boolean
}

function makeSampleButtons(colors: string[]): SampleButton[] {
    return [
        { icon: 'plus', label: 'Add', color: colors[0] },
        { icon: 'settings', label: 'Config', color: colors[1] },
        { icon: 'search', label: 'Search', color: colors[2] },
        { icon: 'briefcase', label: '', color: colors[3] },
        { icon: 'trash-2', label: 'Delete', color: '#ef4444' },
        { icon: undefined, label: 'Text', color: colors[4] },
        { icon: 'pencil', label: 'Edit', color: colors[5], dimmed: true },
        { icon: 'menu', label: 'Menu', color: colors[0], size: BTN_SIZE },
    ]
}

// ── BdxButton showcase ──────────────────────────────────────────────────────

function BdxButtonShowcase() {
    const { theme } = useTheme()
    const autoColors = (theme === 'light' ? LIGHT_THEME : GLOW_NIGHT_THEME).autoColors
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
    const [buttons, setButtons] = useState<SampleButton[]>(() => makeSampleButtons(GLOW_NIGHT_THEME.autoColors))

    const handleEditorChange = (parsed: unknown) => {
        if (selectedIdx === null) return
        if (parsed && typeof parsed === 'object') {
            const next = [...buttons]
            next[selectedIdx] = parsed as SampleButton
            setButtons(next)
        }
    }

    return (
        <div className="flex-1 flex relative">
            {/* Buttons area — centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-lg font-bold mb-1" style={{ color: 'var(--bdx-text)' }}>BdxButton</h2>
                    <p className="text-sm" style={{ color: 'var(--bdx-text-muted)' }}>
                        The core node button. Supports icons, labels, colors, sizing, and disabled states.
                    </p>
                </div>

                <div className="flex flex-wrap gap-5 items-end justify-center">
                    {buttons.map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                            className="flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer group"
                        >
                            <div className={cn(
                                'rounded-full transition-all duration-150',
                                selectedIdx === i
                                    ? 'ring-2 ring-violet-400/50 ring-offset-2'
                                    : 'group-hover:ring-1 group-hover:ring-violet-400/20 group-hover:ring-offset-1'
                            )} style={{ '--tw-ring-offset-color': 'var(--bdx-bg)' } as React.CSSProperties}>
                                <NodeButton
                                    icon={btn.icon}
                                    label={btn.label}
                                    color={btn.color}
                                    size={btn.size ?? 44}
                                    dimmed={btn.dimmed}
                                />
                            </div>
                            <span className="text-[9px] font-mono" style={{ color: 'var(--bdx-text-faint)' }}>
                                {btn.size ? `${btn.size}px` : '44px'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Configurator panel — right side */}
            <div className="w-[320px] shrink-0 m-4 self-stretch rounded-2xl backdrop-blur-xl overflow-hidden flex flex-col" style={{ background: 'var(--bdx-surface)', border: '1px solid var(--bdx-border)' }}>
                {/* Header */}
                <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--bdx-border)' }}>
                    <h3 className="text-xs font-black tracking-tight uppercase" style={{ color: 'var(--bdx-text-secondary)' }}>
                        {selectedIdx !== null ? `Button: ${buttons[selectedIdx].label || buttons[selectedIdx].icon || 'unnamed'}` : 'All Buttons'}
                    </h3>
                </div>
                <CodeViewer
                    data={selectedIdx !== null ? buttons[selectedIdx] : buttons}
                    onChange={selectedIdx !== null ? handleEditorChange : undefined}
                    readOnly={selectedIdx === null}
                />
            </div>
        </div>
    )
}

// ── Main Components Page ─────────────────────────────────────────────────────

export function ComponentsPage() {
    const [activeId, setActiveId] = useState('bdx-button')

    // For "coming soon" components, render the shared ComingSoon page directly
    if (activeId === 'bdx-card') {
        return (
            <ComingSoon
                emoji="🃏"
                description="A beautiful card component for displaying structured content with icons, labels, and actions."
                color="violet"
            />
        )
    }

    return (
        <PageLayout>
            <div className="flex-1 flex pt-14">
                {/* Left sidebar */}
                <aside className="w-[200px] shrink-0 px-3 py-5 space-y-1" style={{ borderRight: '1px solid var(--bdx-border)' }}>
                    <span className="text-[10px] font-black uppercase tracking-widest px-3 mb-3 block" style={{ color: 'var(--bdx-text-faint)' }}>
                        Components
                    </span>
                    {COMPONENTS.map(comp => (
                        <button
                            key={comp.id}
                            onClick={() => setActiveId(comp.id)}
                            className={cn(
                                'w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150 border',
                                activeId === comp.id
                                    ? 'font-semibold text-violet-600 bg-violet-500/15 border-violet-400/30'
                                    : 'border-transparent'
                            )}
                            style={activeId !== comp.id ? { color: 'var(--bdx-text-muted)' } : undefined}
                        >
                            {comp.label}
                            {!comp.ready && (
                                <span className="ml-2 text-[9px] font-mono" style={{ color: 'var(--bdx-text-faint)' }}>soon</span>
                            )}
                        </button>
                    ))}
                </aside>

                {/* Content area */}
                {activeId === 'bdx-button' && <BdxButtonShowcase />}
            </div>
        </PageLayout>
    )
}
