import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // GitHub Pages의 저장소 하위 경로와 일반 정적 호스팅 모두에서 동작합니다.
  base: './',
  plugins: [react()],
})
