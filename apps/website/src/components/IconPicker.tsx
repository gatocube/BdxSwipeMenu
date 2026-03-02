'use client'

import { useState, useMemo } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/utils/utils'
import { allIcons, ALL_ICON_NAMES, GLOW_NIGHT_THEME, LIGHT_THEME } from '@/swipeMenu/ui'
import { NodeButton } from './NodeButton'
import { useTheme } from './ThemeContext'

interface IconPickerProps {
    icon?: string
    color: string
    label: string
    onIconChange?: (icon: string) => void
    onColorChange?: (color: string) => void
    size?: number
    testId?: string
    dimmed?: boolean
}

export function IconPicker({ icon, color, label, onIconChange, onColorChange, size = 56, testId, dimmed }: IconPickerProps) {
    const { theme } = useTheme()
    const autoColors = (theme === 'light' ? LIGHT_THEME : GLOW_NIGHT_THEME).autoColors
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')

    const filteredIcons = useMemo(() => {
        if (!search) return ALL_ICON_NAMES
        const q = search.toLowerCase()
        return ALL_ICON_NAMES.filter(n => n.includes(q))
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
                    <NodeButton testId={testId} icon={icon} label={label} color={color} size={size} dimmed={dimmed} />
                </button>
            </PopoverTrigger>

            <PopoverContent
                className="w-[280px] p-0"
                style={{ background: 'var(--bdx-surface-solid)', border: '1px solid var(--bdx-border-strong)' }}
                side="top"
                align="start"
                sideOffset={8}
            >
                <div className="p-2" style={{ borderBottom: '1px solid var(--bdx-border)' }}>
                    <input
                        type="text"
                        placeholder="Search icons…"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full h-7 px-2 rounded-md text-xs outline-none focus:border-violet-500/40"
                        style={{
                            background: 'var(--bdx-input-bg)',
                            border: '1px solid var(--bdx-border)',
                            color: 'var(--bdx-text-secondary)',
                        }}
                        autoFocus
                    />
                </div>

                {onIconChange && (
                    <div className="p-2 max-h-[200px] overflow-auto">
                        <div className="grid grid-cols-8 gap-1">
                            {filteredIcons.slice(0, 200).map(name => {
                                const Ic = allIcons[name]
                                if (!Ic) return null
                                return (
                                    <button
                                        key={name}
                                        onClick={() => { onIconChange(name); setSearch('') }}
                                        className={cn(
                                            'w-7 h-7 flex items-center justify-center rounded-md cursor-pointer transition-all',
                                            icon === name ? 'bg-violet-500/20 border border-violet-500/40' : 'border border-transparent',
                                        )}
                                        style={icon !== name ? { color: 'var(--bdx-text-muted)' } : undefined}
                                        title={name}
                                    >
                                        <Ic size={14} strokeWidth={2} color={icon === name ? color : 'currentColor'} />
                                    </button>
                                )
                            })}
                            {filteredIcons.length === 0 && (
                                <div className="col-span-8 text-center text-[10px] py-3" style={{ color: 'var(--bdx-text-faint)' }}>No icons match</div>
                            )}
                            {filteredIcons.length > 200 && (
                                <div className="col-span-8 text-center text-[10px] py-1" style={{ color: 'var(--bdx-text-faint)' }}>
                                    {filteredIcons.length - 200} more — type to narrow
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {onColorChange && (
                    <div className="p-2" style={{ borderTop: '1px solid var(--bdx-border)' }}>
                        <div className="flex gap-1.5 flex-wrap">
                            {autoColors.map(c => (
                                <button
                                    key={c}
                                    onClick={() => onColorChange(c)}
                                    className={cn(
                                        'w-6 h-6 rounded-md border-2 transition-all duration-150 cursor-pointer hover:scale-110',
                                        color === c ? 'scale-110' : '',
                                    )}
                                    style={{
                                        background: c,
                                        borderColor: color === c ? 'var(--bdx-text-muted)' : 'var(--bdx-border)',
                                    }}
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
