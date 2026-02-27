import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MobileViewPage } from './pages/Mobile'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <MobileViewPage />
    </StrictMode>,
)

