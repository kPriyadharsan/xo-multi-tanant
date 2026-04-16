import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'socket.io-client': path.resolve(__dirname, 'node_modules/socket.io-client/build/esm/index.js'),
      'react-is': path.resolve(__dirname, 'node_modules/react-is/index.js'),
    },
  },
  optimizeDeps: {
    include: [
      'recharts',
      'socket.io-client',
      'react-is',
      'prop-types',
      'framer-motion',
      'lucide-react'
    ]
  },
  server: {
    port: 5173,
    host: true
  }
})
