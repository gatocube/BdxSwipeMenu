import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HomePage } from './pages/Home'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <HomePage />
    </StrictMode>,
)

