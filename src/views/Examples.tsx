'use client'

import Link from 'next/link'
import { TopNav } from '../components/TopNav'
import { Crosshair, Smartphone, Link2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const EXAMPLES = [
    {
        title: 'Interactive Demo',
        desc: 'Three activation modes (click, hold, swipe), hover-based sub-menu chains, and touch interactions.',
        href: '/demo',
        icon: Crosshair,
        gradient: 'from-violet-500 to-purple-600',
        glow: 'shadow-violet-500/20',
    },
    {
        title: 'Mobile View',
        desc: 'Phone layout with edge and corner anchoring — the menu stays fully inside the viewport.',
        href: '/mobile',
        icon: Smartphone,
        gradient: 'from-emerald-400 to-green-500',
        glow: 'shadow-emerald-400/20',
    },
    {
        title: 'Long Chains',
        desc: 'Real-life action sequences (review flow) with an active chain connector line.',
        href: '/long-chains',
        icon: Link2,
        gradient: 'from-violet-400 to-indigo-500',
        glow: 'shadow-violet-400/20',
    },
]

export function ExamplesPage() {
    return (
        <div className="relative min-h-screen bg-[#070712] text-slate-200">
            {/* Subtle background glow */}
            <div className="absolute w-[800px] h-[600px] bg-violet-600/15 rounded-full blur-3xl top-[-200px] left-[-200px]" />
            <div className="absolute w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl top-40 right-[-300px]" />

            <TopNav />

            <div className="relative z-10 max-w-[1020px] mx-auto pt-[calc(56px+48px)] pb-12 px-6">
                <h1 className="text-3xl font-black tracking-tight mb-2">Examples</h1>
                <p className="text-sm text-slate-400 leading-relaxed mb-10 max-w-lg">
                    Explore different configurations of BdxSwipeMenu in action. Each example focuses on a specific use case.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {EXAMPLES.map(ex => (
                        <Link key={ex.title} href={ex.href} className="group no-underline">
                            <Card className="bg-[#0a0a14]/80 border-white/[0.06] hover:border-white/[0.15] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full">
                                <CardContent className="p-6 flex flex-col gap-4">
                                    {/* Square icon with glow */}
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${ex.gradient} flex items-center justify-center shadow-lg ${ex.glow}`}>
                                        <ex.icon className="w-5 h-5 text-white" />
                                    </div>

                                    <div>
                                        <div className="text-base font-bold tracking-tight mb-2">{ex.title}</div>
                                        <div className="text-sm text-slate-500 leading-relaxed">{ex.desc}</div>
                                    </div>

                                    <div className="mt-auto pt-2">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold border border-white/[0.08] bg-white/[0.03] text-slate-400 group-hover:text-slate-200 group-hover:border-white/[0.15] transition-all duration-200">
                                            Open example →
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
