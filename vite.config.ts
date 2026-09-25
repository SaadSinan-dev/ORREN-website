import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: { manualChunks: (id: string) => /node_modules[\\/](@react-three|three|three-stdlib)[\\/]/.test(id) ? 'three' : undefined },
    },
  },
})
