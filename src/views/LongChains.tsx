import { useCallback, useMemo, useState } from 'react'
import { BdxSwipeMenu, type BdxSwipeMenuActivation } from '../BdxSwipeMenu'
import { TopNav } from '../components/TopNav'

const MODES: { key: BdxSwipeMenuActivation; label: string; desc: string }[] = [
    { key: 'click', label: 'Click', desc: 'Tap / click to open' },
    { key: 'hold', label: 'Hold', desc: 'Long-press ~500 ms' },
    { key: 'swipe', label: 'Swipe', desc: 'Hover to open' },
]

function ModeSelector({ mode, onChange }: { mode: BdxSwipeMenuActivation; onChange: (m: BdxSwipeMenuActivation) => void }) {
    return (
        <div style={{
            position: 'absolute', top: 72, left: '50%', transform: 'translateX(-50%)',
            display: 'flex', gap: 6, zIndex: 10,
            background: 'rgba(10,10,20,0.85)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 12,
            padding: '6px 8px',
            backdropFilter: 'blur(12px)',
        }}>
            {MODES.map(m => (
                <button
                    key={m.key}
                    onClick={() => onChange(m.key)}
                    style={{
                        padding: '6px 16px',
                        borderRadius: 8,
                        border: `1.5px solid ${mode === m.key ? '#8b5cf688' : 'transparent'}`,
                        background: mode === m.key ? 'rgba(139,92,246,0.15)' : 'transparent',
                        color: mode === m.key ? '#c4b5fd' : '#64748b',
                        cursor: 'pointer',
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: 700,
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <span>{m.label}</span>
                    <span style={{ fontSize: 7, fontWeight: 400, opacity: 0.6 }}>{m.desc}</span>
                </button>
            ))}
        </div>
    )
}

function EventLog({ log }: { log: string[] }) {
    return (
        <div style={{
            position: 'absolute', bottom: 16, right: 16,
            width: 360, maxHeight: 180, overflow: 'auto',
            background: 'rgba(10,10,20,0.85)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 10,
            padding: '10px 12px',
            zIndex: 10,
            backdropFilter: 'blur(12px)',
        }}>
            <div style={{
                fontSize: 8, fontWeight: 800, color: '#64748b',
                textTransform: 'uppercase', letterSpacing: '0.6px',
                marginBottom: 6,
                fontFamily: "'JetBrains Mono', monospace",
            }}>
                Review flow chain log
            </div>
            {log.length === 0 ? (
                <div style={{ fontSize: 10, color: '#334155', fontStyle: 'italic' }}>
                    Open Config → Review and follow the chain…
                </div>
            ) : (
                log.map((entry, i) => (
                    <div key={i} style={{
                        fontSize: 10, color: '#cbd5e1',
                        fontFamily: "'JetBrains Mono', monospace",
                        padding: '3px 0',
                        borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                        {entry}
                    </div>
                ))
            )}
        </div>
    )
}

function MockNode({ id, label, selected, onClick, style }: {
    id: string
    label: string
    selected: boolean
    onClick: () => void
    style?: React.CSSProperties
}) {
    return (
        <div
            data-id={id}
            data-testid={`mock-node-${id}`}
            onClick={(e) => { e.stopPropagation(); onClick() }}
            style={{
                position: 'absolute',
                width: 180, height: 84,
                borderRadius: 14,
                background: selected ? 'rgba(139,92,246,0.12)' : 'rgba(15,15,26,0.9)',
                border: `1.5px solid ${selected ? 'rgba(139,92,246,0.55)' : 'rgba(255,255,255,0.10)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.15s',
                touchAction: 'none',
                userSelect: 'none',
                ...style,
            }}
        >
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#e2e8f0' }}>{label}</div>
                <div style={{ fontSize: 9, color: '#64748b', fontFamily: "'JetBrains Mono', monospace", marginTop: 4 }}>
                    data-id="{id}"
                </div>
            </div>
        </div>
    )
}

function formatReviewAction(action: string) {
    if (!action.startsWith('review:')) return action
    const step = action.replace('review:', '')
    const pretty = step
        .split('-').join(' ')
        .replace(/\b\w/g, (m: string) => m.toUpperCase())
    return `review → ${pretty}`
}

export function LongChainsPage() {
    const [mode, setMode] = useState<BdxSwipeMenuActivation>('click')
    const [selected, setSelected] = useState(false)
    const [log, setLog] = useState<string[]>([])

    const nodeId = 'review-node'

    const addLog = useCallback((msg: string) => {
        setLog(prev => [...prev.slice(-18), msg])
    }, [])

    const directions = useMemo(() => (['top', 'right', 'bottom', 'bottom-right'] as const), [])

    return (
        <div
            style={{
                position: 'relative',
                width: '100%', height: '100%',
                background: 'radial-gradient(1000px 700px at 15% 15%, rgba(139,92,246,0.22), transparent 60%), radial-gradient(900px 600px at 85% 20%, rgba(6,182,212,0.16), transparent 55%), #0a0a14',
                fontFamily: 'Inter',
                overflow: 'hidden',
            }}
            onClick={() => setSelected(false)}
        >
            <TopNav />
            <ModeSelector mode={mode} onChange={setMode} />
            <EventLog log={log} />

            <div style={{
                position: 'absolute', bottom: 16, left: 16, zIndex: 10,
                width: 420,
                background: 'rgba(10,10,20,0.78)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 14,
                padding: 12,
                backdropFilter: 'blur(12px)',
            }}>
                <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.2 }}>
                    Long chain example: review flow
                </div>
                <div style={{ marginTop: 6, fontSize: 12, color: '#a8b2c3', lineHeight: 1.45 }}>
                    Open <b>Config</b> → <b>Review</b> and follow the chain:
                    <span style={{ display: 'block', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#cbd5e1' }}>
                        respond → request changes → blockers → tests failed → provide proof link
                    </span>
                    The active chain is always visible via the connector line and the inactive icons are greyed out.
                </div>
            </div>

            <MockNode
                id={nodeId}
                label="PR Review"
                selected={selected}
                onClick={() => setSelected(prev => !prev)}
                style={{
                    top: '50%',
                    left: '36%',
                    transform: 'translate(-50%, -50%)',
                }}
            />

            {selected && (
                <BdxSwipeMenu
                    nodeId={nodeId}
                    currentLabel="PR Review"
                    activationMode={mode}
                    directions={[...directions]}
                    noOverlap
                    preset="long"
                    onAddBefore={(id, type) => { addLog(`before → ${type} (${id})`); setSelected(false) }}
                    onAddAfter={(id, type) => { addLog(`after → ${type} (${id})`); setSelected(false) }}
                    onConfigure={(id, action) => { addLog(`${formatReviewAction(action)} (${id})`); setSelected(false) }}
                    onRename={(id, name) => { addLog(`rename → ${name} (${id})`) }}
                    onDismiss={() => setSelected(false)}
                />
            )}
        </div>
    )
}

