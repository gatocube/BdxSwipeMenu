'use client'

import { cn } from '@/utils/utils'

export function EventLog({
    log,
    title = 'Event Log',
    emptyMessage = 'Interact with a node…',
    className,
}: {
    log: string[]
    title?: string
    emptyMessage?: string
    className?: string
}) {
    return (
        <div
            data-testid="event-log"
            className={cn(
                'bg-[#0a0a14]/85 border border-white/[0.06] rounded-lg backdrop-blur-xl p-2.5 z-10',
                className,
            )}
        >
            <div className="text-[8px] font-bold text-slate-500 uppercase tracking-wide mb-1 font-mono">
                {title}
            </div>
            {log.length === 0 ? (
                <div className="text-[9px] text-slate-700 italic">{emptyMessage}</div>
            ) : (
                log.map((entry, i) => (
                    <div
                        key={i}
                        className="text-[9px] text-slate-400 font-mono py-0.5 border-b border-white/[0.02]"
                    >
                        {entry}
                    </div>
                ))
            )}
        </div>
    )
}
