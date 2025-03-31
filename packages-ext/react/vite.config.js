import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    coverage: {
      exclude: ['node_modules/'],
      reporter: ['text', 'json', 'html'],
    },
    environment: 'jsdom',
    include: ['test/**/*.{test,spec}.{js,ts,jsx,tsx}'],
  },
})
