import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    emptyOutDir: false,
    outDir: '.',
    lib: {
      entry: 'src/main.tsx',
      formats: ['iife'],
      name: 'Dongtan8Practice',
      fileName: () => 'app.bundle.js',
    },
    rollupOptions: {
      output: {
        assetFileNames: asset => asset.name?.endsWith('.css') ? 'app.bundle.css' : 'assets/[name]-[hash][extname]',
      },
    },
  },
})
