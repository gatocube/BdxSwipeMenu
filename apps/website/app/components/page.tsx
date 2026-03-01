'use client'

import dynamic from 'next/dynamic'

const ComponentsPage = dynamic(() => import('../../src/views/Components').then(m => ({ default: m.ComponentsPage })), { ssr: false })

export default function Page() {
    return <ComponentsPage />
}
