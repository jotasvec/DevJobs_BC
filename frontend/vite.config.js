import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { API } from './src/constants'

const local = 'http://localhost:3050'

const proxy = Object.values(API).reduce((acc, route) => {
  // "api/auth" -> "/api"
  const root = "/" + route.split("/")[1];

  acc[root] = {
    target: local,
    changeOrigin: true,
    //bypass: (req) => req.headers.accept?.includes('text/html') ? '/index.html' : undefined 
  }

  return acc; 
}, {});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy
  }
})
