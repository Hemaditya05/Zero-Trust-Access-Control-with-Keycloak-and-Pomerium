import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({ 
  plugins: [react()],
  base: '/audit-logs/',
  build: { outDir: 'dist/audit-logs' }
})
