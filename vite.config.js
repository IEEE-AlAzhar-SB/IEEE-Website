import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_URL,
          changeOrigin: true,
        },
      },
    },
    build: {
      // Split heavy third-party code out of the initial chunk so a
      // public visitor doesn't pay for Swiper / admin auth upfront.
      // (React.lazy in App.jsx puts pages in their own chunks; this
      // groups the vendors those chunks share.)
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          manualChunks: {
            "vendor-react": ["react", "react-dom", "react-router-dom"],
            "vendor-query": ["@tanstack/react-query"],
            "vendor-swiper": ["swiper", "swiper/react", "swiper/modules"],
            "vendor-auth": ["better-auth", "better-auth/react"],
          },
        },
      },
    },
  }
})
