import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiTarget = env.API_PROXY_TARGET || 'https://spectrahive-api.ilyacori.com'

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/health': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          rewrite: () => '/eticore/health',
        },
        '/api/v1': {
          target: apiTarget,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api\/v1/, '/eticore/api/v1'),
        },
      },
    },
  }
})
