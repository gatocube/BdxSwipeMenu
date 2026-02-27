'use client'

import dynamic from 'next/dynamic'

const LongChainsPage = dynamic(() => import('../../src/views/LongChains').then(m => ({ default: m.LongChainsPage })), { ssr: false })

export default function Page() {
    return <LongChainsPage />
}
