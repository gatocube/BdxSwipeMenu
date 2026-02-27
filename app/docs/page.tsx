'use client'

import dynamic from 'next/dynamic'

const DocsPage = dynamic(() => import('../../src/views/Docs').then(m => ({ default: m.DocsPage })), { ssr: false })

export default function Page() {
    return <DocsPage />
}
