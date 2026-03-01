'use client'

import dynamic from 'next/dynamic'

const Demo2Page = dynamic(() => import('../../src/views/Demo2').then(m => ({ default: m.Demo2Page })), { ssr: false })

export default function Page() {
    return <Demo2Page />
}
