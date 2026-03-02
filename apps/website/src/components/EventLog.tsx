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
            className={cn('rounded-lg backdrop-blur-xl p-2.5 z-10', className)}
            style={{ background: 'var(--bdx-surface)', border: '1px solid var(--bdx-border)' }}
        >
            <div className="text-[8px] font-bold uppercase tracking-wide mb-1 font-mono" style={{ color: 'var(--bdx-text-faint)' }}>
                {title}
            </div>
            {log.length === 0 ? (
                <div className="text-[9px] italic" style={{ color: 'var(--bdx-text-faint)' }}>{emptyMessage}</div>
            ) : (
                log.map((entry, i) => (
                    <div
                        key={i}
                        className="text-[9px] font-mono py-0.5"
                        style={{ color: 'var(--bdx-text-muted)', borderBottom: '1px solid var(--bdx-border)' }}
                    >
                        {entry}
                    </div>
                ))
            )}
        </div>
    )
}
