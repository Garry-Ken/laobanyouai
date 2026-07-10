import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Cases from '../pages/Cases'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Cases />
  </StrictMode>,
)
