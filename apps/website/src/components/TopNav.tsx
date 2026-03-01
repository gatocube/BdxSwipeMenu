'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github } from 'lucide-react'
import { cn } from '@/utils/utils'

interface NavItem {
    label: string
    href: string
    match: string[]
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Try it', href: '/demo', match: ['/demo'] },
    { label: 'Multi-node', href: '/demo2', match: ['/demo2'] },
    { label: 'Components', href: '/components', match: ['/components'] },
    { label: 'Docs', href: '/docs', match: ['/docs'] },
    { label: 'Examples', href: '/examples', match: ['/examples'] },
    { label: 'Build Yours', href: '/build-yours', match: ['/build-yours'] },
]

export function TopNav() {
    const [activePath, setActivePath] = useState('')
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        setActivePath(window.location.pathname)
        const handleScroll = () => setScrolled(window.scrollY > 4)
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const isActive = (item: NavItem) =>
        item.match.some(m => activePath === m || activePath.endsWith(m))

    const isHome = activePath.endsWith('/') ||
        activePath.endsWith('/BdxSwipeMenu') ||
        activePath.endsWith('/BdxSwipeMenu/')

    return (
        <nav
            data-testid="top-nav"
            className={cn(
                'fixed top-0 left-0 right-0 h-14 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-300 border-b',
                scrolled
                    ? 'bg-[#070712]/95 backdrop-blur-xl border-white/[0.1] shadow-lg shadow-black/40'
                    : 'bg-[#070712]/70 backdrop-blur-xl border-white/[0.06]'
            )}
        >
            {/* Brand — left */}
            <Link prefetch={false} href="/" className="flex items-center gap-2 no-underline justify-self-start group">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Bdx
                </span>
                <span className={cn(
                    'text-base font-semibold transition-colors duration-200',
                    isHome ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'
                )}>
                    SwipeMenu
                </span>
            </Link>

            {/* Nav Links — center */}
            <div className="flex items-center gap-1">
                {NAV_ITEMS.map(item => {
                    const active = isActive(item)
                    return (
                        <Link
                            key={item.label}
                            prefetch={false}
                            href={item.href}
                            className={cn(
                                'text-sm font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 no-underline whitespace-nowrap',
                                active
                                    ? 'font-bold text-white bg-violet-500/20 border-violet-400/40 shadow-sm shadow-violet-500/10'
                                    : 'text-slate-400 border-transparent hover:text-slate-100 hover:bg-white/[0.06]'
                            )}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* GitHub — right */}
            <div className="justify-self-end">
                <a
                    href="https://github.com/gatocube/BdxSwipeMenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg border border-white/[0.1] bg-white/[0.04] text-slate-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.08] transition-all duration-200"
                    title="GitHub"
                >
                    <Github className="w-4.5 h-4.5" />
                </a>
            </div>
        </nav>
    )
}
