import { TopNav } from './TopNav'

interface PageLayoutProps {
    children: React.ReactNode
    /** Custom background CSS (overrides default dark gradient) */
    background?: string
    /** Additional className for the main wrapper */
    className?: string
}

const DEFAULT_BG = '#070712'

export function PageLayout({ children, background, className = '' }: PageLayoutProps) {
    return (
        <div
            className={`min-h-screen text-slate-200 font-[Inter] flex flex-col ${className}`}
            style={{ background: background || DEFAULT_BG }}
        >
            <TopNav />
            {children}
        </div>
    )
}
