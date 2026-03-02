import { TopNav } from './TopNav'

interface PageLayoutProps {
    children: React.ReactNode
    background?: string
    className?: string
}

export function PageLayout({ children, background, className = '' }: PageLayoutProps) {
    return (
        <div
            className={`min-h-screen font-[Inter] flex flex-col ${className}`}
            style={{ background: background || 'var(--bdx-bg)', color: 'var(--bdx-text)' }}
        >
            <TopNav />
            {children}
        </div>
    )
}
