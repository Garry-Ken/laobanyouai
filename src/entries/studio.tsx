import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Workbench from '../pages/Workbench'
import '../index.css'

// 旧入口 /studio.html 保留:直接进工作台的「排版」步(旧链接与分享不失效)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Workbench defaultTab="typeset" />
  </StrictMode>,
)
