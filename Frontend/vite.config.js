import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:3001',
      '/users': 'http://localhost:3001',
      '/collocations': 'http://localhost:3001',
      '/movements': 'http://localhost:3001',
      '/sections': 'http://localhost:3001',
      '/racks': 'http://localhost:3001',
      '/shelfs': 'http://localhost:3001',
      '/pallets': 'http://localhost:3001',
      '/products': 'http://localhost:3001',
    },
  },
})
