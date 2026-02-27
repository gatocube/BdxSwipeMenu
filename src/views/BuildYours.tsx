import { TopNav } from '../components/TopNav'

export function BuildYoursPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'radial-gradient(900px 700px at 50% 30%, rgba(139,92,246,0.22), transparent 60%), radial-gradient(700px 500px at 70% 60%, rgba(6,182,212,0.12), transparent 50%), #070712',
            color: '#e2e8f0',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <TopNav />

            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                paddingTop: 56,
                padding: '56px 24px 48px',
            }}>
                <div style={{
                    textAlign: 'center',
                    maxWidth: 520,
                }}>
                    {/* Animated glow ring */}
                    <div style={{
                        width: 96,
                        height: 96,
                        margin: '0 auto 32px',
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(139,92,246,0.2) 0%, transparent 70%)',
                        border: '2px solid rgba(139,92,246,0.25)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 40,
                        animation: 'pulse-glow 3s ease-in-out infinite',
                    }}>
                        🛠️
                    </div>

                    <div style={{
                        fontSize: 38,
                        fontWeight: 900,
                        letterSpacing: -0.8,
                        marginBottom: 12,
                        background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                    }}>
                        Coming Soon
                    </div>

                    <div style={{
                        fontSize: 16,
                        color: '#94a3b8',
                        lineHeight: 1.7,
                        marginBottom: 32,
                    }}>
                        A visual configurator to design your own BdxSwipeMenu — pick actions,
                        arrange chains, customize colors, and export ready-to-use code.
                    </div>

                    <div style={{
                        display: 'inline-block',
                        padding: '10px 24px',
                        borderRadius: 12,
                        border: '1px solid rgba(139,92,246,0.3)',
                        background: 'rgba(139,92,246,0.08)',
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#c4b5fd',
                        letterSpacing: 0.2,
                    }}>
                        ⭐ Star the repo to get notified
                    </div>

                    <style>{`
                        @keyframes pulse-glow {
                            0%, 100% {
                                box-shadow: 0 0 20px rgba(139,92,246,0.15), 0 0 60px rgba(139,92,246,0.05);
                                transform: scale(1);
                            }
                            50% {
                                box-shadow: 0 0 30px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1);
                                transform: scale(1.05);
                            }
                        }
                    `}</style>
                </div>
            </div>
        </div>
    )
}
