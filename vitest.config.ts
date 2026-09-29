import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  envPrefix: ['VITE_'],
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    fsModuleCache: true,
    testTimeout: 60_000,
  },
})
