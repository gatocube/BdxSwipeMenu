'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import type { BdxTheme } from '@bdx/swipe-menu'

const STORAGE_KEY = 'bdx-theme'

interface ThemeCtx {
    theme: BdxTheme
    setTheme: (t: BdxTheme) => void
    toggleTheme: () => void
}

const Ctx = createContext<ThemeCtx>({
    theme: 'glow-night',
    setTheme: () => {},
    toggleTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeRaw] = useState<BdxTheme>('glow-night')

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'glow-night') setThemeRaw(stored)
    }, [])

    const setTheme = useCallback((t: BdxTheme) => {
        setThemeRaw(t)
        if (typeof t === 'string') localStorage.setItem(STORAGE_KEY, t)
    }, [])

    const toggleTheme = useCallback(() => {
        setThemeRaw(prev => {
            const next = prev === 'glow-night' ? 'light' : 'glow-night'
            localStorage.setItem(STORAGE_KEY, next)
            return next
        })
    }, [])

    return <Ctx.Provider value={{ theme, setTheme, toggleTheme }}>{children}</Ctx.Provider>
}

export function useTheme() {
    return useContext(Ctx)
}
