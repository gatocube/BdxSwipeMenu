export function HomePage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(1200px 800px at 20% 10%, rgba(139,92,246,0.25), transparent 60%), radial-gradient(900px 600px at 90% 30%, rgba(6,182,212,0.18), transparent 55%), #070712',
            color: '#e2e8f0',
            fontFamily: 'Inter',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
        }}>
            <div style={{
                width: 'min(980px, 100%)',
                borderRadius: 18,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(10,10,20,0.72)',
                backdropFilter: 'blur(14px)',
                boxShadow: '0 18px 70px rgba(0,0,0,0.55)',
                padding: 28,
            }}>
                <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 12,
                    letterSpacing: 0.4,
                    color: '#94a3b8',
                    marginBottom: 10,
                }}>
                    GitHub Pages
                </div>

                <div style={{
                    fontSize: 34,
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 10,
                }}>
                    BdxSwipeMenu
                </div>

                <div style={{
                    maxWidth: 760,
                    color: '#a8b2c3',
                    fontSize: 14,
                    lineHeight: 1.55,
                    marginBottom: 18,
                }}>
                    Radial swipe menu for touchscreen & desktop — React + framer-motion. Explore the interactive demo or open the docs page for usage examples and runnable sandboxes.
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                    gap: 12,
                    marginTop: 16,
                }}>
                    <a href="./demo.html" style={cardStyle('#8b5cf6')}>
                        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4 }}>Demo</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                            Activation modes, hover chains, touch interactions.
                        </div>
                        <div style={pillStyle}>Open demo →</div>
                    </a>

                    <a href="./docs.html" style={cardStyle('#06b6d4')}>
                        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4 }}>Docs</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                            Usage examples, props, sandbox links.
                        </div>
                        <div style={pillStyle}>Open docs →</div>
                    </a>

                    <a href="https://github.com/gatocube/BdxSwipeMenu" style={cardStyle('#f59e0b')}>
                        <div style={{ fontSize: 12, fontWeight: 800, letterSpacing: 0.4 }}>Repository</div>
                        <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 6 }}>
                            Source code, issues, and releases.
                        </div>
                        <div style={pillStyle}>View on GitHub →</div>
                    </a>
                </div>

                <div style={{
                    marginTop: 18,
                    fontSize: 11,
                    color: '#64748b',
                }}>
                    Tip: if you are using GitHub Pages, links are relative to the project base path.
                </div>
            </div>
        </div>
    )
}

function cardStyle(accent: string): React.CSSProperties {
    return {
        borderRadius: 14,
        border: `1px solid ${accent}33`,
        background: 'rgba(15,15,26,0.7)',
        padding: 16,
        textDecoration: 'none',
        color: '#e2e8f0',
        boxShadow: `0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px ${accent}10`,
        position: 'relative',
        overflow: 'hidden',
    }
}

const pillStyle: React.CSSProperties = {
    display: 'inline-block',
    marginTop: 12,
    padding: '7px 10px',
    borderRadius: 999,
    border: '1px solid rgba(255,255,255,0.10)',
    background: 'rgba(255,255,255,0.03)',
    fontSize: 11,
    fontWeight: 800,
    letterSpacing: 0.3,
}

