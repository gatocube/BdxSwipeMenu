'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Github, Sun, Moon } from 'lucide-react'
import { cn } from '@/utils/utils'
import { useTheme } from './ThemeContext'

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
    const { theme, toggleTheme } = useTheme()
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
            className="fixed top-0 left-0 right-0 h-14 z-50 grid grid-cols-[1fr_auto_1fr] items-center px-6 transition-all duration-300 border-b backdrop-blur-xl"
            style={{
                background: scrolled ? 'var(--bdx-nav-bg-scroll)' : 'var(--bdx-nav-bg)',
                borderColor: scrolled ? 'var(--bdx-border-strong)' : 'var(--bdx-border)',
                boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.15)' : 'none',
            }}
        >
            {/* Brand — left */}
            <Link prefetch={false} href="/" className="flex items-center gap-2 no-underline justify-self-start group">
                <span className="text-xl font-black tracking-tight bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                    Bdx
                </span>
                <span
                    className="text-base font-semibold transition-colors duration-200"
                    style={{ color: isHome ? 'var(--bdx-text)' : 'var(--bdx-text-muted)' }}
                >
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
                                    ? 'font-bold text-violet-400 bg-violet-500/20 border-violet-400/40 shadow-sm shadow-violet-500/10'
                                    : 'border-transparent'
                            )}
                            style={active ? undefined : { color: 'var(--bdx-text-muted)' }}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </div>

            {/* Right — theme toggle + GitHub */}
            <div className="justify-self-end flex items-center gap-2">
                <button
                    data-testid="theme-toggle"
                    onClick={toggleTheme}
                    className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 cursor-pointer"
                    style={{
                        borderColor: 'var(--bdx-border)',
                        background: 'var(--bdx-hover-bg)',
                        color: 'var(--bdx-text-muted)',
                    }}
                    title={`Switch to ${theme === 'glow-night' ? 'light' : 'glow-night'} theme`}
                >
                    {theme === 'glow-night' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
                <a
                    href="https://github.com/gatocube/BdxSwipeMenu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200"
                    style={{
                        borderColor: 'var(--bdx-border)',
                        background: 'var(--bdx-hover-bg)',
                        color: 'var(--bdx-text-muted)',
                    }}
                    title="GitHub"
                >
                    <Github className="w-4.5 h-4.5" />
                </a>
            </div>
        </nav>
    )
}
