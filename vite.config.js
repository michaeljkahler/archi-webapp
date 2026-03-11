import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Custom Vite plugin to remove crossorigin attributes from HTML.
 * Required for file:// protocol support — Chrome blocks CORS on file:// origins.
 */
function removeCrossOrigin() {
  return {
    name: 'remove-crossorigin',
    enforce: 'post',
    transformIndexHtml(html) {
      return html.replace(/ crossorigin/g, '')
    }
  }
}

export default defineConfig({
  base: './',
  build: {
    modulePreload: false,   // Prevents <link rel="modulepreload" crossorigin>
    cssCodeSplit: false,     // Single CSS file
    target: 'es2020',
  },
  plugins: [
    react(),
    removeCrossOrigin(),
    VitePWA({
      registerType: 'prompt',  // Don't auto-register on file://
      injectRegister: null,    // We handle SW registration manually
      includeAssets: ['icons/*.png', 'images/**/*'],
      manifest: {
        name: 'ARCHI Baumdiagnose',
        short_name: 'ARCHI',
        description: 'Interaktiver Bestimmungsschlüssel zur Vitalitätsdiagnose von Bäumen',
        theme_color: '#2E7D32',
        background_color: '#F5F5F5',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
