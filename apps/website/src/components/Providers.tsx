'use client'

import { useEffect } from 'react'
import { ThemeProvider, useTheme } from './ThemeContext'

function BodyThemeSync() {
    const { theme } = useTheme()
    useEffect(() => {
        const name = typeof theme === 'string' ? theme : 'custom'
        document.body.setAttribute('data-bdx-theme', name)
        document.documentElement.classList.toggle('dark', name !== 'light')
    }, [theme])
    return null
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <BodyThemeSync />
            {children}
        </ThemeProvider>
    )
}
