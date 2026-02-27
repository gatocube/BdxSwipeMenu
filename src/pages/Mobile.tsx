import { useCallback, useEffect, useMemo, useState } from 'react'
import { BdxSwipeMenu, type BdxSwipeMenuActivation } from '../BdxSwipeMenu'

const MODES: { key: BdxSwipeMenuActivation; label: string; desc: string }[] = [
    { key: 'click', label: 'Click', desc: 'Tap / click to open' },
    { key: 'hold', label: 'Hold', desc: 'Long-press ~500 ms' },
    { key: 'swipe', label: 'Swipe', desc: 'Hover / drag to expand' },
]

type AnchorKey =
    | 'center'
    | 'top-left'
    | 'top'
    | 'top-right'
    | 'left'
    | 'right'
    | 'bottom-left'
    | 'bottom'
    | 'bottom-right'

const ANCHORS: { key: AnchorKey; label: string; hint: string }[] = [
    { key: 'center', label: 'Center', hint: 'Balanced radial layout' },
    { key: 'top-left', label: 'Top-left', hint: 'Corner constraints' },
    { key: 'top', label: 'Top edge', hint: 'Avoid off-screen top' },
    { key: 'top-right', label: 'Top-right', hint: 'Corner constraints' },
    { key: 'left', label: 'Left edge', hint: 'Avoid off-screen left' },
    { key: 'right', label: 'Right edge', hint: 'Avoid off-screen right' },
    { key: 'bottom-left', label: 'Bottom-left', hint: 'Corner constraints' },
    { key: 'bottom', label: 'Bottom edge', hint: 'Avoid off-screen bottom' },
    { key: 'bottom-right', label: 'Bottom-right', hint: 'Corner constraints' },
]

function ModeSelector({ mode, onChange }: { mode: BdxSwipeMenuActivation; onChange: (m: BdxSwipeMenuActivation) => void }) {
    return (
        <div style={{
            display: 'flex', gap: 6,
            background: 'rgba(10,10,20,0.82)',
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
                        padding: '6px 14px',
                        borderRadius: 9,
                        border: `1.5px solid ${mode === m.key ? '#8b5cf688' : 'transparent'}`,
                        background: mode === m.key ? 'rgba(139,92,246,0.15)' : 'transparent',
                        color: mode === m.key ? '#c4b5fd' : '#64748b',
                        cursor: 'pointer',
                        fontFamily: 'Inter',
                        fontSize: 11,
                        fontWeight: 800,
                        transition: 'all 0.15s',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <span>{m.label}</span>
                    <span style={{ fontSize: 7, fontWeight: 500, opacity: 0.65 }}>{m.desc}</span>
                </button>
            ))}
        </div>
    )
}

function anchorStyle(anchor: AnchorKey): React.CSSProperties {
    const pad = 14
    const edge = 0
    const to = (t: Partial<React.CSSProperties>) => t

    switch (anchor) {
        case 'center': return to({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' })
        case 'top-left': return to({ top: pad, left: pad })
        case 'top': return to({ top: pad, left: '50%', transform: 'translateX(-50%)' })
        case 'top-right': return to({ top: pad, right: pad })
        case 'left': return to({ top: '50%', left: edge, transform: 'translateY(-50%)' })
        case 'right': return to({ top: '50%', right: edge, transform: 'translateY(-50%)' })
        case 'bottom-left': return to({ bottom: pad, left: pad })
        case 'bottom': return to({ bottom: pad, left: '50%', transform: 'translateX(-50%)' })
        case 'bottom-right': return to({ bottom: pad, right: pad })
    }
}

function Pill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
    return (
        <button
            onClick={onClick}
            style={{
                padding: '8px 10px',
                borderRadius: 999,
                border: `1px solid ${active ? 'rgba(139,92,246,0.55)' : 'rgba(255,255,255,0.10)'}`,
                background: active ? 'rgba(139,92,246,0.13)' : 'rgba(255,255,255,0.03)',
                color: active ? '#e9d5ff' : '#94a3b8',
                cursor: 'pointer',
                fontSize: 11,
                fontWeight: 850,
                letterSpacing: 0.2,
                fontFamily: 'Inter',
                whiteSpace: 'nowrap',
            }}
        >
            {children}
        </button>
    )
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
    return (
        <div style={{
            width: 360,
            height: 740,
            borderRadius: 46,
            background: 'linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))',
            border: '1px solid rgba(255,255,255,0.14)',
            boxShadow: '0 30px 90px rgba(0,0,0,0.6)',
            padding: 12,
            position: 'relative',
        }}>
            <img
                src="./phone-frame.svg"
                alt=""
                aria-hidden
                style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none',
                    opacity: 0.95,
                }}
            />
            <div style={{
                position: 'absolute',
                inset: 8,
                borderRadius: 40,
                background: 'rgba(0,0,0,0.65)',
                border: '1px solid rgba(255,255,255,0.10)',
            }} />

            <div style={{
                position: 'absolute',
                top: 20, left: '50%',
                transform: 'translateX(-50%)',
                width: 138,
                height: 22,
                borderRadius: 999,
                background: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.08)',
            }} />

            <div style={{
                position: 'absolute',
                left: 12,
                right: 12,
                top: 42,
                bottom: 22,
                borderRadius: 34,
                overflow: 'hidden',
                background: 'radial-gradient(800px 560px at 20% 15%, rgba(139,92,246,0.25), transparent 58%), radial-gradient(700px 520px at 90% 30%, rgba(6,182,212,0.18), transparent 55%), #070712',
                border: '1px solid rgba(255,255,255,0.08)',
            }}>
                {children}
            </div>
        </div>
    )
}

function EventLog({ log }: { log: string[] }) {
    return (
        <div style={{
            position: 'absolute', bottom: 12, left: 12, right: 12,
            maxHeight: 130,
            overflow: 'auto',
            background: 'rgba(10,10,20,0.70)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 14,
            padding: '10px 12px',
            backdropFilter: 'blur(12px)',
            pointerEvents: 'none',
        }}>
            <div style={{
                fontSize: 9, fontWeight: 900, color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.7px',
                marginBottom: 6,
                fontFamily: "'JetBrains Mono', monospace",
            }}>
                Automation chain log
            </div>
            {log.length === 0 ? (
                <div style={{ fontSize: 11, color: '#475569', lineHeight: 1.4 }}>
                    Pick a position, open the menu, and follow a chain like:
                    <span style={{ display: 'block', marginTop: 6, fontFamily: "'JetBrains Mono', monospace", color: '#cbd5e1' }}>
                        after → job → script:sh → config → review → proof link
                    </span>
                </div>
            ) : (
                log.map((entry, i) => (
                    <div key={i} style={{
                        fontSize: 10, color: '#e2e8f0',
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

function formatAction(action: string) {
    if (action.startsWith('attach:')) return `config → attach → ${action.replace('attach:', '')}`
    if (action.startsWith('review:')) return `config → review → ${action.replace('review:', '').split('-').join(' ')}`
    return `config → ${action}`
}

export function MobileViewPage() {
    const [mode, setMode] = useState<BdxSwipeMenuActivation>('click')
    const [anchor, setAnchor] = useState<AnchorKey>('center')
    const [open, setOpen] = useState(false)
    const [log, setLog] = useState<string[]>([])
    const [isNarrow, setIsNarrow] = useState(() => window.innerWidth < 980)

    const nodeId = 'mobile-node'

    const selectedAnchorMeta = useMemo(() => ANCHORS.find(a => a.key === anchor)!, [anchor])

    const addLog = useCallback((msg: string) => {
        setLog(prev => [...prev.slice(-16), msg])
    }, [])

    const onNodeClick = useCallback(() => {
        if (mode === 'swipe') return
        setOpen(prev => !prev)
    }, [mode])

    const onNodeHover = useCallback(() => {
        if (mode === 'swipe') setOpen(true)
    }, [mode])

    const onNodeTouchSelect = useCallback(() => {
        if (mode === 'swipe') setOpen(true)
    }, [mode])

    const nodeStyle = useMemo(() => ({
        ...anchorStyle(anchor),
        position: 'absolute' as const,
        width: 44,
        height: 44,
        borderRadius: 14,
        border: '1.5px solid rgba(139,92,246,0.55)',
        background: open ? 'rgba(139,92,246,0.16)' : 'rgba(15,15,26,0.85)',
        backdropFilter: 'blur(12px)',
        display: 'grid',
        placeItems: 'center',
        cursor: 'pointer',
        boxShadow: open ? '0 0 24px rgba(139,92,246,0.22)' : '0 10px 34px rgba(0,0,0,0.35)',
        userSelect: 'none' as const,
        WebkitUserSelect: 'none' as const,
        touchAction: 'none' as const,
    }), [anchor, open])

    useEffect(() => {
        const onResize = () => setIsNarrow(window.innerWidth < 980)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    return (
        <div
            style={{
                width: '100%',
                height: '100%',
                background: '#0a0a14',
                overflow: 'hidden',
                display: 'grid',
                placeItems: 'center',
                padding: 18,
                gap: 16,
            }}
            onClick={() => setOpen(false)}
        >
            <div style={{ width: 'min(1100px, 100%)' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: 'wrap',
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ fontSize: 16, fontWeight: 950, letterSpacing: 0.2 }}>
                            Mobile view — menu positioning
                        </div>
                        <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.35 }}>
                            Select an anchor point inside the phone screen and verify the radial menu stays visible.
                        </div>
                    </div>

                    <ModeSelector mode={mode} onChange={(m) => { setMode(m); setOpen(false) }} />
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: isNarrow ? '1fr' : 'minmax(320px, 1fr) minmax(340px, 420px)',
                    gap: 18,
                    alignItems: 'center',
                }}>
                    <div style={{
                        borderRadius: 18,
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(10,10,20,0.55)',
                        backdropFilter: 'blur(12px)',
                        padding: 14,
                        order: isNarrow ? 2 : 1,
                    }}>
                        <div style={{
                            fontSize: 11,
                            color: '#cbd5e1',
                            fontWeight: 900,
                            letterSpacing: 0.25,
                            marginBottom: 8,
                        }}>
                            Menu anchor
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {ANCHORS.map(a => (
                                <Pill
                                    key={a.key}
                                    active={a.key === anchor}
                                    onClick={() => { setAnchor(a.key); setOpen(false) }}
                                >
                                    {a.label}
                                </Pill>
                            ))}
                        </div>

                        <div style={{
                            marginTop: 10,
                            fontFamily: "'JetBrains Mono', monospace",
                            fontSize: 11,
                            color: '#64748b',
                        }}>
                            Selected: <span style={{ color: '#e2e8f0', fontWeight: 800 }}>{selectedAnchorMeta.label}</span> — {selectedAnchorMeta.hint}
                        </div>
                    </div>

                    <div style={{ justifySelf: 'center', order: isNarrow ? 1 : 2 }}>
                        <PhoneFrame>
                            <div style={{ position: 'absolute', inset: 0 }}>
                                <div style={{
                                    position: 'absolute',
                                    top: 12,
                                    left: 12,
                                    right: 12,
                                    background: 'rgba(10,10,20,0.55)',
                                    border: '1px solid rgba(255,255,255,0.07)',
                                    borderRadius: 14,
                                    padding: '10px 12px',
                                    backdropFilter: 'blur(12px)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                            <div style={{ fontSize: 12, fontWeight: 950 }}>
                                                Tap target
                                            </div>
                                            <div style={{ fontSize: 10, color: '#94a3b8' }}>
                                                {mode === 'hold' ? 'Long-press to expand buttons' : mode === 'swipe' ? 'Hover/drag to expand buttons' : 'Tap to open menu'}
                                            </div>
                                        </div>
                                        <div style={{
                                            fontFamily: "'JetBrains Mono', monospace",
                                            fontSize: 10,
                                            color: '#64748b',
                                        }}>
                                            {selectedAnchorMeta.label}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    data-id={nodeId}
                                    data-testid="mobile-anchor-node"
                                    onClick={(e) => { e.stopPropagation(); onNodeClick() }}
                                    onMouseEnter={onNodeHover}
                                    onTouchStart={onNodeTouchSelect}
                                    style={nodeStyle}
                                >
                                    <span style={{ fontSize: 18 }}>⚡</span>
                                </div>

                                <EventLog log={log} />
                            </div>

                            {open && (
                                <BdxSwipeMenu
                                    nodeId={nodeId}
                                    currentLabel="Automation"
                                    activationMode={mode}
                                    noOverlap
                                    preset="long"
                                    onAddBefore={(id, type) => { addLog(`before → ${type} (${id})`); setOpen(false) }}
                                    onAddAfter={(id, type) => { addLog(`after → ${type} (${id})`); setOpen(false) }}
                                    onConfigure={(id, action) => { addLog(`${formatAction(action)} (${id})`); if (action !== 'rename') setOpen(false) }}
                                    onRename={(id, name) => { addLog(`config → rename → ${name} (${id})`) }}
                                    onDismiss={() => setOpen(false)}
                                />
                            )}
                        </PhoneFrame>
                    </div>
                </div>
            </div>
        </div>
    )
}

