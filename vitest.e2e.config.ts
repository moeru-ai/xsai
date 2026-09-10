import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['packages/**/e2e/**/*.test.ts'],
    testTimeout: 120_000,
  },
})
