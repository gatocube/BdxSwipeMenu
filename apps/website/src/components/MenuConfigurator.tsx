'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils/utils'
import { BTN_SIZE, resolveColor, GLOW_NIGHT_THEME, LIGHT_THEME } from '@/swipeMenu/ui'
import type { BdxSwipeMenuActivation, BdxSwipeMenuState, MenuNode } from '@bdx/swipe-menu'
import { useTheme } from './ThemeContext'
import { IconPicker } from './IconPicker'
import { CodeViewer } from './CodeViewer'
import { menuStateSchema } from './editor/menuStateSchema'

// ── Types ────────────────────────────────────────────────────────────────────

interface MenuConfiguratorProps {
    state: BdxSwipeMenuState
    onStateChange: (state: BdxSwipeMenuState) => void
    className?: string
}

// ── Activation mode options ──────────────────────────────────────────────────

const ACTIVATION_OPTIONS: { value: BdxSwipeMenuActivation; label: string; desc: string }[] = [
    { value: 'swipe', label: 'Swipe', desc: 'Hover to open' },
    { value: 'click', label: 'Click', desc: 'Click to open' },
    { value: 'hold', label: 'Hold', desc: 'Long-press ~500ms' },
]

// ── Component ────────────────────────────────────────────────────────────────

export function MenuConfigurator({ state, onStateChange, className }: MenuConfiguratorProps) {
    const { theme } = useTheme()
    const t = theme === 'light' ? LIGHT_THEME : GLOW_NIGHT_THEME
    const [animated, setAnimated] = useState(true)
    const [animKey, setAnimKey] = useState(0)  // bump to re-trigger entrance animation

    const nodes = state.nodes

    const update = (patch: Partial<BdxSwipeMenuState>) => {
        onStateChange({ ...state, ...patch })
    }

    const updateNode = (index: number, patch: Partial<MenuNode>) => {
        const next = [...nodes]
        next[index] = { ...next[index], ...patch }
        onStateChange({ ...state, nodes: next })
    }



    return (
        <div className={cn(
            'rounded-2xl backdrop-blur-xl overflow-hidden flex flex-col',
            className,
        )} style={{ background: 'var(--bdx-surface)', border: '1px solid var(--bdx-border)' }}>
            {/* Header */}
            <div className="px-4 py-3" style={{ borderBottom: '1px solid var(--bdx-border)' }}>
                <h3 className="text-xs font-black tracking-tight uppercase" style={{ color: 'var(--bdx-text-secondary)' }}>
                    Menu Configurator
                </h3>
            </div>

            {/* Two-column body: JSON left, Controls right */}
            <div className="flex flex-1 min-h-0">
                {/* JSON Panel — left */}
                <div className="w-[260px] flex flex-col shrink-0 min-h-0" style={{ borderRight: '1px solid var(--bdx-border)' }}>
                    <CodeViewer
                        data={cleanForDisplay(state)}
                        schema={menuStateSchema}
                        className="flex-1"
                        onChange={(parsed) => {
                            if (parsed && typeof parsed === 'object' && 'nodes' in (parsed as Record<string, unknown>)) {
                                onStateChange(parsed as BdxSwipeMenuState)
                            }
                        }}
                    />
                </div>

                {/* Controls — right */}
                <div className="flex-1 px-4 py-3 space-y-4 overflow-auto">
                    {/* Activation Mode */}
                    <div className="space-y-1.5">
                        <Label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--bdx-text-faint)' }}>
                            Activation Mode
                        </Label>
                        <div className="flex gap-1">
                            {ACTIVATION_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => update({ activation: opt.value })}
                                    className={cn(
                                        'flex-1 flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg border-[1.5px] cursor-pointer text-[10px] font-bold transition-all duration-150',
                                        state.activation === opt.value
                                            ? 'border-violet-500/50 bg-violet-500/15 text-violet-600'
                                            : '',
                                    )}
                                    style={state.activation !== opt.value ? { borderColor: 'var(--bdx-border)', color: 'var(--bdx-text-faint)' } : undefined}
                                >
                                    <span>{opt.label}</span>
                                    <span className="text-[7px] font-normal opacity-60">{opt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <Separator style={{ background: 'var(--bdx-border)' }} />

                    {/* Toggles */}
                    <div className="space-y-2">
                        <ToggleRow
                            label="Animated"
                            checked={animated}
                            onChange={v => { setAnimated(v); setAnimKey(k => k + 1) }}
                        />
                        <ToggleRow
                            label="Chain Line"
                            checked={state.showChainLine ?? true}
                            onChange={v => update({ showChainLine: v })}
                        />
                        <ToggleRow
                            label="No Overlap"
                            checked={state.noOverlap ?? false}
                            onChange={v => update({ noOverlap: v })}
                        />
                    </div>

                    {/* Node Tiles */}
                    {nodes && (
                        <>
                            <Separator style={{ background: 'var(--bdx-border)' }} />
                            <div className="space-y-1.5">
                                <Label className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--bdx-text-faint)' }}>
                                    Nodes
                                </Label>
                                <div className="flex flex-wrap gap-1.5" key={animKey}>
                                    {nodes.map((node, i) => (
                                        <motion.div
                                            key={node.key}
                                            initial={animated ? { opacity: 0, scale: 0.5, y: 8 } : false}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            transition={animated ? { delay: i * 0.08, duration: 0.3, ease: 'easeOut' } : { duration: 0 }}
                                        >
                                            <IconPicker
                                                testId={`node-tile-${node.key}`}
                                                icon={node.icon}
                                                color={resolveColor(node, i, t.autoColors)}
                                                label={node.label}
                                                size={i === 0 ? BTN_SIZE : 44}
                                                dimmed={!!node.disabled}
                                                onIconChange={icon => updateNode(i, { icon })}
                                                onColorChange={color => updateNode(i, { color })}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function ToggleRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--bdx-text-faint)' }}>{label}</span>
            <button
                onClick={() => onChange(!checked)}
                className={cn(
                    'w-8 h-[18px] rounded-full transition-all duration-200 relative cursor-pointer',
                    checked ? 'bg-violet-500/50' : '',
                )}
                style={checked ? undefined : { background: 'var(--bdx-border-strong)' }}
            >
                <div className={cn(
                    'absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all duration-200',
                    checked ? 'left-[16px]' : 'left-[2px]',
                )} />
            </button>
        </div>
    )
}

function cleanForDisplay(obj: unknown): unknown {
    if (Array.isArray(obj)) return obj.map(cleanForDisplay)
    if (obj && typeof obj === 'object') {
        const cleaned: Record<string, unknown> = {}
        for (const [k, v] of Object.entries(obj)) {
            if (k === 'testIdKey') continue
            cleaned[k] = cleanForDisplay(v)
        }
        return cleaned
    }
    return obj
}
