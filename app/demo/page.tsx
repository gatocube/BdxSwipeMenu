'use client'

import dynamic from 'next/dynamic'

const ButtonsMenuPage = dynamic(() => import('../../src/views/Demo').then(m => ({ default: m.ButtonsMenuPage })), { ssr: false })

export default function Page() {
    return <ButtonsMenuPage />
}
