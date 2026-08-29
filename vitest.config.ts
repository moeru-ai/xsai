import { defineConfig } from 'vitest/config'

export default defineConfig({
  envPrefix: ['VITE_'],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    testTimeout: 60_000,
  },
})
