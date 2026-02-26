import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { DocsPage } from './pages/Docs'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <DocsPage />
    </StrictMode>,
)

