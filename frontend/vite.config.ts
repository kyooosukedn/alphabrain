import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Strip console.log/warn/error in production builds
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          // React core — shared by everything, cached once
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // State management
          'vendor-state': ['@reduxjs/toolkit', 'react-redux', '@tanstack/react-query'],
          // Charting — only loaded by ProgressPage & analytics
          'vendor-charts': ['recharts'],
          // Animation — loaded by ProgressPage & Schedule
          'vendor-motion': ['framer-motion'],
          // Graph visualization — loaded by KnowledgeGraphPage only
          'vendor-graph': ['react-force-graph'],
        },
      },
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
})
