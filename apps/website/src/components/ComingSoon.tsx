import { PageLayout } from './PageLayout'
import { Button } from '@/components/ui/button'

interface ComingSoonProps {
    emoji: string
    description: string
    /** 'cyan' or 'violet' color theme */
    color?: 'cyan' | 'violet'
}

const THEMES = {
    cyan: {
        bg: undefined,
        ring: 'bg-[radial-gradient(circle,rgba(6,182,212,0.2)_0%,transparent_70%)] border-cyan-500/25',
        btn: 'border-cyan-500/30 bg-cyan-500/8 text-cyan-300 hover:bg-cyan-500/15 hover:border-cyan-500/50',
        glow1: 'rgba(6,182,212,0.15)',
        glow2: 'rgba(6,182,212,0.05)',
        glow3: 'rgba(6,182,212,0.3)',
        glow4: 'rgba(6,182,212,0.1)',
    },
    violet: {
        bg: undefined,
        ring: 'bg-[radial-gradient(circle,rgba(139,92,246,0.2)_0%,transparent_70%)] border-violet-500/25',
        btn: 'border-violet-500/30 bg-violet-500/8 text-violet-300 hover:bg-violet-500/15 hover:border-violet-500/50',
        glow1: 'rgba(139,92,246,0.15)',
        glow2: 'rgba(139,92,246,0.05)',
        glow3: 'rgba(139,92,246,0.3)',
        glow4: 'rgba(139,92,246,0.1)',
    },
}

export function ComingSoon({ emoji, description, color = 'cyan' }: ComingSoonProps) {
    const t = THEMES[color]
    return (
        <PageLayout background={t.bg}>
            <div className="flex-1 flex items-center justify-center pt-14 px-6 pb-12">
                <div className="text-center max-w-[520px]">
                    <div className={`w-24 h-24 mx-auto mb-8 rounded-full ${t.ring} border-2 flex items-center justify-center text-[40px] animate-[pulse-glow_3s_ease-in-out_infinite]`}>
                        {emoji}
                    </div>

                    <h1 className="text-4xl font-black tracking-tight mb-3" style={{ color: 'var(--bdx-text)' }}>
                        Coming Soon
                    </h1>

                    <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--bdx-text-faint)' }}>
                        {description}
                    </p>

                    <Button variant="outline" className={`${t.btn} font-bold text-sm tracking-tight`}>
                        ⭐ Star the repo to get notified
                    </Button>

                    <style>{`
                        @keyframes pulse-glow {
                            0%, 100% {
                                box-shadow: 0 0 20px ${t.glow1}, 0 0 60px ${t.glow2};
                                transform: scale(1);
                            }
                            50% {
                                box-shadow: 0 0 30px ${t.glow3}, 0 0 80px ${t.glow4};
                                transform: scale(1.05);
                            }
                        }
                    `}</style>
                </div>
            </div>
        </PageLayout>
    )
}
