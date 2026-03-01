import { cn } from '@/utils/utils'
import type { BdxSwipeMenuState } from '@bdx/swipe-menu'

/**
 * Live JSON state panel for demo pages.
 * Strips `testIdKey` for cleaner display.
 */
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
        <div className={cn(
            'bg-[#0a0a14]/80 border border-white/[0.08] rounded-[14px] backdrop-blur-xl overflow-hidden',
            className,
        )}>
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
                <span className="text-[10px] font-black text-slate-400 tracking-tight uppercase">Menu State JSON</span>
                <span className="text-[9px] text-slate-600 font-mono">{json.split('\n').length} lines</span>
            </div>
            <pre className="p-3 text-[10px] leading-[1.6] text-slate-400 font-mono overflow-auto max-h-[calc(100vh-200px)] m-0">
                {json}
            </pre>
        </div>
    )
}
