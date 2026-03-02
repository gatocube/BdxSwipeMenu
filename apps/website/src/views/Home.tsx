'use client'

import Link from 'next/link'
import { PageLayout } from '../components/PageLayout'
import { Crosshair, BookOpen, Smartphone, Link2, Github, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const FEATURES = [
    {
        title: 'Demo',
        desc: 'Activation modes, hover chains, touch interactions.',
        href: '/demo',
        icon: Crosshair,
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
        ring: 'ring-violet-500/20',
    },
    {
        title: 'Docs',
        desc: 'Usage examples, props, sandbox links.',
        href: '/docs',
        icon: BookOpen,
        gradient: 'from-cyan-400 to-blue-500',
        glow: 'shadow-cyan-400/20',
        ring: 'ring-cyan-400/20',
    },
    {
        title: 'Mobile View',
        desc: 'Phone layout + edge/corner anchoring.',
        href: '/mobile',
        icon: Smartphone,
        gradient: 'from-emerald-400 to-green-500',
        glow: 'shadow-emerald-400/20',
        ring: 'ring-emerald-400/20',
    },
    {
        title: 'Long Chains',
        desc: 'Real-life action sequences with active chain line.',
        href: '/long-chains',
        icon: Link2,
        gradient: 'from-violet-400 to-indigo-500',
        glow: 'shadow-violet-400/20',
        ring: 'ring-violet-400/20',
    },
    {
        title: 'Repository',
        desc: 'Source code, issues, and releases.',
        href: 'https://github.com/gatocube/BdxSwipeMenu',
        icon: Github,
        gradient: 'from-amber-400 to-orange-500',
        glow: 'shadow-amber-400/20',
        ring: 'ring-amber-400/20',
    },
]

function FeatureCard({ f }: { f: typeof FEATURES[number] }) {
    return (
        <Card
            className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden"
            style={{ background: 'var(--bdx-card-bg)', borderColor: 'var(--bdx-border)' }}
        >
            <CardContent className="p-5 flex flex-col gap-3">
                <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.glow} ring-1 ${f.ring}`}>
                    <f.icon className="w-5 h-5 text-white" />
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                </div>
                <div>
                    <div className="text-sm font-bold tracking-tight mb-1" style={{ color: 'var(--bdx-text)' }}>
                        {f.title}
                    </div>
                    <div className="text-xs leading-relaxed" style={{ color: 'var(--bdx-text-faint)' }}>
                        {f.desc}
                    </div>
                </div>
                <div className="mt-auto pt-1">
                    <span className="inline-flex items-center text-[11px] font-bold tracking-wide transition-colors duration-200" style={{ color: 'var(--bdx-text-faint)' }}>
                        Open →
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export function HomePage() {
    return (
        <PageLayout className="relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-20">
                <div className="w-full max-w-[980px]">
                    <div
                        className="rounded-2xl backdrop-blur-xl shadow-2xl p-8 md:p-10"
                        style={{ background: 'var(--bdx-surface)', border: '1px solid var(--bdx-border)' }}
                    >
                        <Badge variant="outline" className="mb-4 text-xs font-mono tracking-wider border-violet-500/30 text-violet-500">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            React + framer-motion
                        </Badge>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
                            <span className="bg-gradient-to-r from-violet-500 via-cyan-400 to-violet-500 bg-clip-text text-transparent">
                                BdxSwipeMenu
                            </span>
                        </h1>

                        <p className="max-w-2xl text-base leading-relaxed mb-8" style={{ color: 'var(--bdx-text-muted)' }}>
                            Radial swipe menu for touchscreen & desktop. Explore the interactive demo or open the docs page for usage examples and runnable sandboxes.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {FEATURES.map((f) => {
                                const isExternal = f.href.startsWith('http')
                                return isExternal ? (
                                    <a key={f.title} href={f.href} className="group no-underline" target="_blank" rel="noopener noreferrer">
                                        <FeatureCard f={f} />
                                    </a>
                                ) : (
                                    <Link key={f.title} href={f.href} prefetch={false} className="group no-underline">
                                        <FeatureCard f={f} />
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}
