'use client'

import dynamic from 'next/dynamic'

const ExamplesPage = dynamic(() => import('../../src/views/Examples').then(m => ({ default: m.ExamplesPage })), { ssr: false })

export default function Page() {
    return <ExamplesPage />
}
