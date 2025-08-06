import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['5173-iy9bgcjtw6pmmuz9hj4s9-03cf3fe4.manusvm.computer']
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
