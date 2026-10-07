import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  envPrefix: ['VITE_'],
  test: {
    coverage: {
      exclude: ['packages/*/src/generated/**'],
      include: ['packages/*/src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    fsModuleCache: true,
    testTimeout: 60_000,
  },
})
