'use client'

import { useState, useEffect } from 'react'
import { Home, Github, Menu as MenuIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
    label: string
    href: string
    match: string[]
}

const NAV_ITEMS: NavItem[] = [
    { label: 'Try it', href: '/demo', match: ['/demo'] },
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
                'fixed top-0 left-0 right-0 h-14 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-300 border-b border-white/[0.06]',
                scrolled ? 'bg-[#070712]/90 backdrop-blur-xl' : 'bg-[#070712]/65 backdrop-blur-xl'
            )}
        >
            {/* Brand — left */}
            <a href="/" className="flex items-center gap-2 no-underline justify-self-start group">
                <span className="text-lg font-black tracking-tight bg-gradient-to-r from-violet-500 to-cyan-400 bg-clip-text text-transparent">
                    Bdx
                </span>
                <span className={cn(
                    'text-sm font-semibold transition-colors duration-200',
                    isHome ? 'text-slate-200' : 'text-slate-500 group-hover:text-slate-300'
                )}>
                    SwipeMenu
                </span>
            </a>

            {/* Nav Links — center */}
            <div className="flex items-center gap-1">
                {NAV_ITEMS.map(item => {
                    const active = isActive(item)
                    return (
                        <a
                            key={item.label}
                            href={item.href}
                            className={cn(
                                'text-[13px] font-medium px-3.5 py-1.5 rounded-lg border transition-all duration-200 no-underline whitespace-nowrap',
                                active
                                    ? 'font-bold text-slate-200 bg-violet-500/12 border-violet-500/25'
                                    : 'text-slate-500 border-transparent hover:text-slate-300 hover:bg-white/[0.04]'
                            )}
                        >
                            {item.label}
                        </a>
                    )
                })}
            </div>

            {/* GitHub — right */}
            <div className="justify-self-end">
                <a
                    href="https://github.com/gatocube/BdxSwipeMenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-white/[0.08] bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:border-white/[0.15] transition-all duration-200"
                    title="GitHub"
                >
                    <Github className="w-4 h-4" />
                </a>
            </div>
        </nav>
    )
}
