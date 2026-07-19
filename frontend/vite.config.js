import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

const local = 'http://localhost:3050'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy : {
      '/api': local,
      '/users': local,
      '/jobs': local,
      '/technologies': local
    }
  }
})
