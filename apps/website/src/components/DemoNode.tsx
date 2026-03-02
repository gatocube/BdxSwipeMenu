import { useCallback, useRef } from 'react'
import { cn } from '@/utils/utils'

export function DemoNode({
    id, label, color, icon, selected,
    onSelect, onHover, onHold, onTouchSelect,
    className,
}: {
    id: string
    label: string
    color: string
    icon: string
    selected: boolean
    onSelect: () => void
    onHover?: () => void
    onHold?: () => void
    onTouchSelect?: () => void
    className?: string
}) {
    const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const didHoldRef = useRef(false)

    const handlePointerDown = useCallback(() => {
        if (!onHold) return
        didHoldRef.current = false
        holdTimerRef.current = setTimeout(() => {
            didHoldRef.current = true
            onHold()
            holdTimerRef.current = null
        }, 500)
    }, [onHold])

    const handlePointerUp = useCallback(() => {
        if (holdTimerRef.current) {
            clearTimeout(holdTimerRef.current)
            holdTimerRef.current = null
        }
    }, [])

    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation()
        if (didHoldRef.current) { didHoldRef.current = false; return }
        onSelect()
    }, [onSelect])

    return (
        <div
            data-id={id}
            data-testid={`mock-node-${id}`}
            onClick={handleClick}
            onMouseEnter={onHover}
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onTouchStart={() => onTouchSelect?.()}
            className={cn(
                'absolute w-[120px] h-[60px] rounded-[10px] flex items-center gap-2 px-3 cursor-pointer transition-all duration-150 touch-none select-none',
                selected ? 'border-[1.5px]' : 'border-[1.5px]',
                className,
            )}
            style={{
                ...(selected
                    ? {
                        background: `${color}20`,
                        borderColor: `${color}66`,
                        boxShadow: `0 0 20px ${color}22`,
                    }
                    : {
                        background: 'var(--bdx-card-bg)',
                        borderColor: 'var(--bdx-border-strong)',
                    }
                ),
            }}
        >
            <span className="text-xl">{icon}</span>
            <div>
                <div className="text-[11px] font-bold font-[Inter]" style={{ color: 'var(--bdx-text)' }}>{label}</div>
                <div className="text-[7px] font-mono" style={{ color: 'var(--bdx-text-faint)' }}>{id}</div>
            </div>
        </div>
    )
}
