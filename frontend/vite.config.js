import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      'socket.io-client': path.resolve(__dirname, 'node_modules/socket.io-client/build/esm/index.js'),
    },
  },
  server: {
    port: 5173,
  }
})
