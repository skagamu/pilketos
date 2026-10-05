import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/pilketos/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Listen on all local IPs
    strictPort: true, // Don't try another port if 5173 is taken
    allowedHosts: 'all', // Allow requests from any host (like Tailscale IPs)
  }
})