'use client'

import { useState, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/utils'
import { ICON_MAP, AUTO_COLORS } from '@/swipeMenu/ui'
import { NodeButton } from './NodeButton'
import type { LucideIcon } from 'lucide-react'

// ── Types ────────────────────────────────────────────────────────────────────

interface IconPickerProps {
    /** Current icon name (lucide key) */
    icon?: string
    /** Resolved hex color */
    color: string
    /** Label shown below icon */
    label: string
    /** Called when icon changes */
    onIconChange?: (icon: string) => void
    /** Called when color changes */
    onColorChange?: (color: string) => void
    /** Size of the tile */
    size?: number
    /** Test ID for e2e selection */
    testId?: string
    /** Whether the tile appears dimmed (disabled) */
    dimmed?: boolean
}

// ── All available icon names ─────────────────────────────────────────────────

const ICON_NAMES = Object.keys(ICON_MAP)

// ── Component ────────────────────────────────────────────────────────────────

export function IconPicker({ icon, color, label, onIconChange, onColorChange, size = 56, testId, dimmed }: IconPickerProps) {
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const filteredIcons = useMemo(() => {
        if (!search) return ICON_NAMES
        const q = search.toLowerCase()
        return ICON_NAMES.filter(n => n.includes(q))
    }, [search])

    return (
        <Popover open={open} onOpenChange={o => { setOpen(o); if (!o) setSearch('') }}>
            <PopoverTrigger asChild>
                <button
                    style={{
                        border: 'none', background: 'none', padding: 0, margin: 0,
                        display: 'inline-block', lineHeight: 0, cursor: 'pointer',
                        font: 'inherit', color: 'inherit',
                    }}
                    title={`${label} — ${icon || 'no icon'}`}
                >
                    <NodeButton
                        testId={testId}
                        icon={icon}
                        label={label}
                        color={color}
                        size={size}
                        dimmed={dimmed}
                    />
                </button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[280px] p-0 bg-[#12121e] border-white/[0.12]"
                side="top"
                align="start"
                sideOffset={8}
            >
                {/* Search */}
                <div className="p-2 border-b border-white/[0.06]">
                    <input
                        type="text"
                        placeholder="Search icons…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-7 px-2 rounded-md bg-white/[0.05] border border-white/[0.08] text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-violet-500/40"
                        autoFocus
                    />
                </div>

                {/* Icon Grid */}
                {onIconChange && (
                    <div className="p-2 max-h-[160px] overflow-auto">
                        <div className="grid grid-cols-8 gap-1">
                            {filteredIcons.map(name => {
                                const Ic = ICON_MAP[name]
                                return (
                                    <button
                                        key={name}
                                        onClick={() => { onIconChange(name); setSearch('') }}
                                        className={cn(
                                            'w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-all hover:bg-white/[0.08]',
                                            icon === name ? 'bg-violet-500/20 border border-violet-500/40' : 'border border-transparent',
                                        )}
                                        title={name}
                                    >
                                        <Ic size={14} strokeWidth={2} color={icon === name ? color : '#94a3b8'} />
                                    </button>
                                )
                            })}
                            {filteredIcons.length === 0 && (
                                <div className="col-span-8 text-center text-[10px] text-slate-600 py-3">No icons match</div>
                            )}
                        </div>
                    </div>
                )}

                {/* Color Palette */}
                {onColorChange && (
                    <div className="p-2 border-t border-white/[0.06]">
                        <div className="flex gap-1.5 flex-wrap">
                            {AUTO_COLORS.map(c => (
                                <button
                                    key={c}
                                    onClick={() => onColorChange(c)}
                                    className={cn(
                                        'w-6 h-6 rounded-md border-2 transition-all duration-150 cursor-pointer hover:scale-110',
                                        color === c ? 'border-white/60 scale-110' : 'border-white/[0.08]',
                                    )}
                                    style={{ background: c }}
                                    title={c}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    )
}
