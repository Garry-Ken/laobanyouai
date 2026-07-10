import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Intel from '../pages/Intel'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Intel />
  </StrictMode>,
)
