import { cn } from '@/utils/utils'
import type { BdxSwipeMenuState } from '@bdx/swipe-menu'

export function StatePanel({ state, className }: { state: BdxSwipeMenuState; className?: string }) {
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

    const json = JSON.stringify(cleanForDisplay(state), null, 2)

    return (
        <div
            className={cn('rounded-[14px] backdrop-blur-xl overflow-hidden', className)}
            style={{ background: 'var(--bdx-surface)', border: '1px solid var(--bdx-border)' }}
        >
            <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid var(--bdx-border)' }}>
                <span className="text-[10px] font-black tracking-tight uppercase" style={{ color: 'var(--bdx-text-muted)' }}>Menu State JSON</span>
                <span className="text-[9px] font-mono" style={{ color: 'var(--bdx-text-faint)' }}>{json.split('\n').length} lines</span>
            </div>
            <pre className="p-3 text-[10px] leading-[1.6] font-mono overflow-auto max-h-[calc(100vh-200px)] m-0" style={{ color: 'var(--bdx-text-muted)' }}>
                {json}
            </pre>
        </div>
    )
}
