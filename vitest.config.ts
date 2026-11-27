import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  envPrefix: ['VITE_'],
  test: {
    coverage: {
      exclude: ['packages/*/src/generated/**', 'packages-ext/providers/src/full.ts', 'packages-ext/providers/src/models/**', 'packages-ext/providers/src/providers/**'],
      include: ['packages/*/src/**/*.{ts,tsx}', 'packages-ext/*/src/**/*.{ts,tsx}'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    exclude: [...configDefaults.exclude, '**/e2e/**'],
    fsModuleCache: true,
    testTimeout: 60_000,
  },
})
