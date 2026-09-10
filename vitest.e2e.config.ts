import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    env: {
      XSAI_E2E_BASE_URL: 'http://localhost:11434/v1/',
      XSAI_E2E_MODEL: 'qwen3.5:0.8b',
    },
    include: ['packages/**/e2e/**/*.test.ts'],
    testTimeout: 120_000,
  },
})
