import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Workbench from '../pages/Workbench'
import '../index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Workbench defaultTab="write" />
  </StrictMode>,
)
