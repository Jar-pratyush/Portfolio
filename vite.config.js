import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// plain static build, cloudflare pages just serves dist/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'es2020',
  },
})
