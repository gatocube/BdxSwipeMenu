import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { LongChainsPage } from './pages/LongChains'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <LongChainsPage />
    </StrictMode>,
)

