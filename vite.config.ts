import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    https: false,
    port: 5173,
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval';
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        img-src 'self' https://archivosminio.upea.bo https://img.youtube.com data: blob:;
        font-src 'self' data: https://fonts.googleapis.com https://fonts.gstatic.com;
        connect-src 'self' https://apiadministrador.upea.bo https://servicioadministrador.upea.bo;
        frame-src 'self' https://www.youtube.com https://youtube.com https://archivosminio.upea.bo blob:;
        object-src 'none';
        base-uri 'self';
        form-action 'self';
        frame-ancestors 'none';
      `.replace(/\s{2,}/g, ' ').trim()
    }
  },
  build: {
    chunkSizeWarningLimit: 1000  // ← SOLO ESTA LÍNEA NUEVA
  }
});