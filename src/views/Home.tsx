'use client'

import Link from 'next/link'
import { TopNav } from '../components/TopNav'
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

function FloatingOrb({ className }: { className?: string }) {
    return (
        <div className={`absolute rounded-full blur-3xl ${className}`} />
    )
}

export function HomePage() {
    return (
        <div className="relative min-h-screen bg-[#070712] text-slate-200 overflow-hidden">
            {/* Background orbs */}
            <FloatingOrb className="w-[600px] h-[600px] bg-violet-600 -top-40 -left-40 opacity-15" />
            <FloatingOrb className="w-[500px] h-[500px] bg-cyan-500 top-20 right-[-200px] opacity-10" />
            <FloatingOrb className="w-[400px] h-[400px] bg-indigo-500 bottom-[-100px] left-1/3 opacity-10" />

            {/* Grid pattern overlay */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                    backgroundSize: '80px 80px',
                }}
            />

            <TopNav />

            <div className="relative z-10 flex items-center justify-center min-h-screen px-6 pt-20">
                <div className="w-full max-w-[980px]">
                    {/* Hero section */}
                    <div className="rounded-2xl border border-white/[0.08] bg-[#0a0a14]/70 backdrop-blur-xl shadow-2xl shadow-black/50 p-8 md:p-10">
                        <Badge variant="outline" className="mb-4 text-xs font-mono tracking-wider border-violet-500/30 text-violet-400">
                            <Sparkles className="w-3 h-3 mr-1.5" />
                            React + framer-motion
                        </Badge>

                        <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
                            <span className="bg-gradient-to-r from-violet-400 via-cyan-300 to-violet-400 bg-clip-text text-transparent">
                                BdxSwipeMenu
                            </span>
                        </h1>

                        <p className="max-w-2xl text-slate-400 text-base leading-relaxed mb-8">
                            Radial swipe menu for touchscreen & desktop. Explore the interactive demo or open the docs page for usage examples and runnable sandboxes.
                        </p>

                        {/* Feature cards with square icon buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {FEATURES.map((f) => {
                                const isExternal = f.href.startsWith('http')
                                const Wrapper = isExternal ? 'a' : Link
                                const extraProps = isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {}
                                return (
                                    <Wrapper key={f.title} href={f.href} className="group no-underline" {...extraProps}>
                                        <Card className="bg-[#0f0f1a]/80 border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl overflow-hidden">
                                            <CardContent className="p-5 flex flex-col gap-3">
                                                {/* Square icon button with glow */}
                                                <div className={`relative w-11 h-11 rounded-xl bg-gradient-to-br ${f.gradient} flex items-center justify-center shadow-lg ${f.glow} ring-1 ${f.ring}`}>
                                                    <f.icon className="w-5 h-5 text-white" />
                                                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${f.gradient} opacity-0 group-hover:opacity-40 blur-xl transition-opacity duration-500`} />
                                                </div>

                                                <div>
                                                    <div className="text-sm font-bold tracking-tight text-slate-200 mb-1">
                                                        {f.title}
                                                    </div>
                                                    <div className="text-xs text-slate-500 leading-relaxed">
                                                        {f.desc}
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-1">
                                                    <span className="inline-flex items-center text-[11px] font-bold tracking-wide text-slate-500 group-hover:text-slate-300 transition-colors duration-200">
                                                        Open →
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Wrapper>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
