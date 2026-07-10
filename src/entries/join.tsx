import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Join from '../pages/Join'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Join />
  </StrictMode>,
)
