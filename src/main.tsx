import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ButtonsMenuPage } from './pages/Demo'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ButtonsMenuPage />
    </StrictMode>,
)
