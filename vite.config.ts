import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production
// export default defineConfig({
//   plugins: [react()],
// })

// Development
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
