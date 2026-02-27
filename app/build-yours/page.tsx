'use client'

import dynamic from 'next/dynamic'

const BuildYoursPage = dynamic(() => import('../../src/views/BuildYours').then(m => ({ default: m.BuildYoursPage })), { ssr: false })

export default function Page() {
    return <BuildYoursPage />
}
