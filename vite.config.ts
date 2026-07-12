import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// 自定义域名从根提供服务，base 必须是 '/'（不是 '/repo/'）。
// MPA：四个真实 HTML 入口，各自返回 200 与独立 meta，
// 迁移到国内 CDN 时无需任何 rewrite 规则。
export default defineConfig({
  base: '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        cases: resolve(__dirname, 'cases.html'),
        intel: resolve(__dirname, 'intel.html'),
        workbench: resolve(__dirname, 'workbench.html'),
        write: resolve(__dirname, 'write.html'),
        studio: resolve(__dirname, 'studio.html'),
        score: resolve(__dirname, 'score.html'),
        join: resolve(__dirname, 'join.html'),
        // GitHub Pages 对未知路径回落到 dist/404.html
        notfound: resolve(__dirname, '404.html'),
      },
    },
  },
})
