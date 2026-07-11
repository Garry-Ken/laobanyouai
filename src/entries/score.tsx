import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Score from '../pages/Score'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Score />
  </StrictMode>,
)
