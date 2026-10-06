import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// En desarrollo, /api y /health se redirigen al backend local.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:3001',
      '/health': 'http://localhost:3001',
    },
  },
});
