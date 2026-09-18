import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Bind to every interface so the container port can be published.
    host: true,
    port: 5173,
    // Inotify events do not always cross the bind mount, so poll instead.
    watch: { usePolling: true },
  },
  preview: {
    host: true,
    port: 4173,
  },
})
