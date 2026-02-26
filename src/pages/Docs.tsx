import { useMemo, useState } from 'react'

export function DocsPage() {
    const [copied, setCopied] = useState(false)

    const code = useMemo(() => (
        `import { BdxSwipeMenu } from 'bdx-swipe-menu'\n\n` +
        `<BdxSwipeMenu\n` +
        `  nodeId="node-1"\n` +
        `  currentLabel="My Node"\n` +
        `  activationMode="click"\n` +
        `  onAddBefore={(id, type) => console.log('before', id, type)}\n` +
        `  onAddAfter={(id, type) => console.log('after', id, type)}\n` +
        `  onConfigure={(id, action) => console.log('config', id, action)}\n` +
        `  onRename={(id, name) => console.log('rename', id, name)}\n` +
        `  onDismiss={() => console.log('dismiss')}\n` +
        `/>`
    ), [])

    const stackblitz = 'https://stackblitz.com/github/gatocube/BdxSwipeMenu?file=src/pages/Demo.tsx'
    const codesandbox = 'https://codesandbox.io/p/sandbox/github/gatocube/BdxSwipeMenu?file=src/pages/Demo.tsx'
    const stackblitzLong = 'https://stackblitz.com/github/gatocube/BdxSwipeMenu?file=src/pages/LongChains.tsx'
    const codesandboxLong = 'https://codesandbox.io/p/sandbox/github/gatocube/BdxSwipeMenu?file=src/pages/LongChains.tsx'

    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(1100px 720px at 15% 10%, rgba(6,182,212,0.18), transparent 60%), radial-gradient(900px 540px at 85% 20%, rgba(139,92,246,0.22), transparent 55%), #070712',
            color: '#e2e8f0',
            fontFamily: 'Inter',
            padding: 24,
        }}>
            <div style={{ width: 'min(1020px, 100%)', margin: '0 auto' }}>
                <nav style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18 }}>
                    <a href="./index.html" style={navLinkStyle}>Home</a>
                    <a href="./demo.html" style={navLinkStyle}>Demo</a>
                    <a href="./long-chains.html" style={navLinkStyle}>Long chains</a>
                    <div style={{ flex: 1 }} />
                    <a href="https://github.com/gatocube/BdxSwipeMenu" style={navLinkStyle}>GitHub</a>
                </nav>

                <div style={{
                    borderRadius: 18,
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(10,10,20,0.70)',
                    backdropFilter: 'blur(14px)',
                    boxShadow: '0 18px 70px rgba(0,0,0,0.55)',
                    padding: 24,
                }}>
                    <div style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>
                        Docs
                    </div>
                    <div style={{ color: '#a8b2c3', fontSize: 14, lineHeight: 1.6, marginBottom: 18 }}>
                        Everything here is runnable. Use the links below to open the repo in an online editor and run the demo instantly.
                    </div>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 10,
                        marginBottom: 18,
                    }}>
                        <a href={stackblitz} style={actionBtn('#8b5cf6')}>Open in StackBlitz</a>
                        <a href={codesandbox} style={actionBtn('#06b6d4')}>Open in CodeSandbox</a>
                        <a href="./demo.html" style={actionBtn('#f59e0b')}>Open Demo Page</a>
                        <a href={stackblitzLong} style={actionBtn('#a78bfa')}>Long chain on StackBlitz</a>
                        <a href={codesandboxLong} style={actionBtn('#22d3ee')}>Long chain on CodeSandbox</a>
                        <a href="./long-chains.html" style={actionBtn('#22c55e')}>Open Long Chains Page</a>
                    </div>

                    <section style={{ marginTop: 8 }}>
                        <div style={sectionTitle}>Quick start</div>
                        <div style={sectionBody}>
                            Import the component and handle the callback “chains” (e.g. <code>after → job → script:js</code>).
                        </div>

                        <div style={{
                            borderRadius: 14,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(15,15,26,0.72)',
                            overflow: 'hidden',
                            marginTop: 10,
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px 12px',
                                borderBottom: '1px solid rgba(255,255,255,0.06)',
                                color: '#94a3b8',
                                fontSize: 11,
                                fontFamily: "'JetBrains Mono', monospace",
                            }}>
                                <span>Example</span>
                                <button
                                    onClick={async () => {
                                        await navigator.clipboard.writeText(code)
                                        setCopied(true)
                                        setTimeout(() => setCopied(false), 900)
                                    }}
                                    style={{
                                        cursor: 'pointer',
                                        fontSize: 11,
                                        fontWeight: 800,
                                        color: copied ? '#22c55e' : '#e2e8f0',
                                        borderRadius: 10,
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        background: 'rgba(255,255,255,0.03)',
                                        padding: '6px 10px',
                                    }}
                                >
                                    {copied ? 'Copied' : 'Copy'}
                                </button>
                            </div>
                            <pre style={{
                                margin: 0,
                                padding: 12,
                                fontSize: 12,
                                lineHeight: 1.5,
                                overflowX: 'auto',
                                color: '#cbd5e1',
                                fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
                            }}>
                                {code}
                            </pre>
                        </div>
                    </section>

                    <section style={{ marginTop: 18 }}>
                        <div style={sectionTitle}>Props</div>
                        <div style={sectionBody}>
                            The menu tracks the on-screen position of the node element by querying <code>[data-id="nodeId"]</code>.
                            It renders into a fixed overlay and prevents text selection and touch scrolling for reliable gestures.
                        </div>

                        <div style={{
                            marginTop: 10,
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                            gap: 10,
                        }}>
                            {[
                                ['activationMode', '"click" | "hold" | "swipe"', 'How the menu opens and expands.'],
                                ['directions', '("top" | "right" | "bottom" | "left" | "bottom-right")[]', 'Show only some directions (useful near screen edges).'],
                                ['noOverlap', 'boolean', 'Push buttons outward so they do not overlap the node.'],
                                ['showActiveChainLinkLine', 'boolean', 'Enabled by default: draws a connector line for the active chain of icons.'],
                                ['preset', '"default" | "long"', 'Demo-only preset that adds a long real-life review flow chain.'],
                                ['onAddBefore / onAddAfter', '(nodeId, widgetType) => void', 'widgetType contains chains like "job", "script:js", "ai:planner".'],
                                ['onConfigure', '(nodeId, action) => void', 'action contains chains like "attach:note", "settings", "delete".'],
                                ['onRename', '(nodeId, newName) => void', 'Inline rename flow.'],
                            ].map(([name, type, desc]) => (
                                <div key={name} style={{
                                    borderRadius: 14,
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    background: 'rgba(15,15,26,0.60)',
                                    padding: 14,
                                }}>
                                    <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 0.2 }}>{name}</div>
                                    <div style={{ marginTop: 6, fontSize: 11, color: '#94a3b8', fontFamily: "'JetBrains Mono', monospace" }}>{type}</div>
                                    <div style={{ marginTop: 8, fontSize: 12, color: '#a8b2c3', lineHeight: 1.45 }}>{desc}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

const navLinkStyle: React.CSSProperties = {
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.2,
    color: '#e2e8f0',
    textDecoration: 'none',
    borderRadius: 999,
    padding: '8px 12px',
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.03)',
}

function actionBtn(color: string): React.CSSProperties {
    return {
        display: 'inline-block',
        textDecoration: 'none',
        color: '#e2e8f0',
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: 0.2,
        padding: '10px 12px',
        borderRadius: 12,
        border: `1px solid ${color}44`,
        background: 'rgba(15,15,26,0.72)',
        boxShadow: `0 10px 28px rgba(0,0,0,0.35), 0 0 0 1px ${color}10`,
    }
}

const sectionTitle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 900,
    letterSpacing: 0.3,
    color: '#e2e8f0',
}

const sectionBody: React.CSSProperties = {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 1.55,
    color: '#a8b2c3',
}

