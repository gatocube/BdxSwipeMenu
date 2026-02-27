'use client'

import dynamic from 'next/dynamic'

const MobileViewPage = dynamic(() => import('../../src/views/Mobile').then(m => ({ default: m.MobileViewPage })), { ssr: false })

export default function Page() {
    return <MobileViewPage />
}
