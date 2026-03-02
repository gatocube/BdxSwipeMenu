import './globals.css'
import type { Metadata } from 'next'
import { Providers } from '../src/components/Providers'

export const metadata: Metadata = {
    title: 'BdxSwipeMenu',
    description: 'Radial swipe menu for touchscreen & desktop — React + framer-motion',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark min-h-screen">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700;800&display=swap" rel="stylesheet" />
            </head>
            <body className="font-[Inter] antialiased overflow-x-hidden min-h-screen">
                <Providers>{children}</Providers>
            </body>
        </html>
    )
}
