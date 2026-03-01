'use client'

import { useState } from 'react'
import { PageLayout } from '../components/PageLayout'
import { NodeButton } from '../components/NodeButton'
import { ComingSoon } from '../components/ComingSoon'
import { CodeViewer } from '../components/CodeViewer'
import { cn } from '@/utils/utils'

const BTN_SIZE = 56
const AUTO_COLORS = [
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

const SAMPLE_BUTTONS: SampleButton[] = [
    { icon: 'plus', label: 'Add', color: AUTO_COLORS[0] },
    { icon: 'settings', label: 'Config', color: AUTO_COLORS[1] },
    { icon: 'search', label: 'Search', color: AUTO_COLORS[2] },
    { icon: 'briefcase', label: '', color: AUTO_COLORS[3] },
    { icon: 'trash-2', label: 'Delete', color: '#ef4444' },
    { icon: undefined, label: 'Text', color: AUTO_COLORS[4] },
    { icon: 'pencil', label: 'Edit', color: AUTO_COLORS[5], dimmed: true },
    { icon: 'menu', label: 'Menu', color: AUTO_COLORS[0], size: BTN_SIZE },
]

// ── BdxButton showcase ──────────────────────────────────────────────────────

function BdxButtonShowcase() {
    const [selectedIdx, setSelectedIdx] = useState<number | null>(null)

    return (
        <div className="flex-1 flex relative">
            {/* Buttons area — centered */}
            <div className="flex-1 flex flex-col items-center justify-center px-10 py-8">
                <div className="text-center mb-8">
                    <h2 className="text-lg font-bold text-slate-100 mb-1">BdxButton</h2>
                    <p className="text-sm text-slate-400">
                        The core node button. Supports icons, labels, colors, sizing, and disabled states.
                    </p>
                </div>

                <div className="flex flex-wrap gap-5 items-end justify-center">
                    {SAMPLE_BUTTONS.map((btn, i) => (
                        <button
                            key={i}
                            onClick={() => setSelectedIdx(selectedIdx === i ? null : i)}
                            className="flex flex-col items-center gap-2 bg-transparent border-none cursor-pointer group"
                        >
                            <div className={cn(
                                'rounded-full transition-all duration-150',
                                selectedIdx === i
                                    ? 'ring-2 ring-violet-400/50 ring-offset-2 ring-offset-[#070712]'
                                    : 'group-hover:ring-1 group-hover:ring-white/10 group-hover:ring-offset-1 group-hover:ring-offset-[#070712]'
                            )}>
                                <NodeButton
                                    icon={btn.icon}
                                    label={btn.label}
                                    color={btn.color}
                                    size={btn.size ?? 44}
                                    dimmed={btn.dimmed}
                                />
                            </div>
                            <span className="text-[9px] text-slate-500 font-mono">
                                {btn.size ? `${btn.size}px` : '44px'}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Configurator panel — right side */}
            <div className="w-[320px] shrink-0 m-4 self-stretch bg-[#0a0a14]/90 border border-white/[0.08] rounded-2xl backdrop-blur-xl overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-4 py-3 border-b border-white/[0.06]">
                    <h3 className="text-xs font-black text-slate-300 tracking-tight uppercase">
                        {selectedIdx !== null ? `Button: ${SAMPLE_BUTTONS[selectedIdx].label || SAMPLE_BUTTONS[selectedIdx].icon || 'unnamed'}` : 'All Buttons'}
                    </h3>
                </div>
                <CodeViewer data={selectedIdx !== null ? SAMPLE_BUTTONS[selectedIdx] : SAMPLE_BUTTONS} />
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
                <aside className="w-[200px] shrink-0 border-r border-white/[0.06] px-3 py-5 space-y-1">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3 mb-3 block">
                        Components
                    </span>
                    {COMPONENTS.map(comp => (
                        <button
                            key={comp.id}
                            onClick={() => setActiveId(comp.id)}
                            className={cn(
                                'w-full text-left text-sm px-3 py-2 rounded-lg transition-all duration-150 border',
                                activeId === comp.id
                                    ? 'font-semibold text-white bg-violet-500/15 border-violet-400/30'
                                    : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/[0.04]'
                            )}
                        >
                            {comp.label}
                            {!comp.ready && (
                                <span className="ml-2 text-[9px] text-slate-600 font-mono">soon</span>
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
