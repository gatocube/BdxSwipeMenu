'use client'

import dynamic from 'next/dynamic'

const DemoPage = dynamic(() => import('../../src/views/Demo').then(m => ({ default: m.DemoPage })), { ssr: false })

export default function Page() {
    return <DemoPage />
}
