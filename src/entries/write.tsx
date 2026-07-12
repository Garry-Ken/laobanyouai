import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Write from '../pages/Write'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Write />
  </StrictMode>,
)
