'use client'

import type { BdxSwipeMenuActivation } from '@bdx/swipe-menu'
import { cn } from '@/utils/utils'

const MODES: { key: BdxSwipeMenuActivation; label: string; desc: string }[] = [
    { key: 'click', label: 'Click', desc: 'Tap / click to open' },
    { key: 'hold', label: 'Hold', desc: 'Long-press ~500 ms' },
    { key: 'swipe', label: 'Swipe', desc: 'Hover to open' },
]

export function ModeSelector({
    mode,
    onChange,
    className,
}: {
    mode: BdxSwipeMenuActivation
    onChange: (m: BdxSwipeMenuActivation) => void
    className?: string
}) {
    return (
        <div
            className={cn(
                'flex gap-1.5 bg-[#0a0a14]/85 border border-white/[0.08] rounded-xl px-2 py-1.5 backdrop-blur-xl',
                className,
            )}
        >
            {MODES.map(m => (
                <button
                    key={m.key}
                    onClick={() => onChange(m.key)}
                    className={cn(
                        'flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg border-[1.5px] cursor-pointer text-[11px] font-bold transition-all duration-150 font-[Inter]',
                        mode === m.key
                            ? 'border-violet-500/50 bg-violet-500/15 text-violet-300'
                            : 'border-transparent text-slate-500 hover:text-slate-400',
                    )}
                >
                    <span>{m.label}</span>
                    <span className="text-[7px] font-normal opacity-60">{m.desc}</span>
                </button>
            ))}
        </div>
    )
}
