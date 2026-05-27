import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // ✅ CONFIGURACIÓN DE SERVIDOR PARA OWASP ZAP
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    open: false,
    cors: true,
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    },
  },
  
  // ✅ CONFIGURACIÓN DE BUILD SIMPLIFICADA (SIN ERRORES)
  build: {
    outDir: 'dist',
    sourcemap: false,       // No exponer source maps
    minify: true,           // ✅ Usa minificación por defecto (sin terserOptions)
  },
})