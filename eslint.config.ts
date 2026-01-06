import { defineConfig } from '@moeru/eslint-config'

export default defineConfig()
  .append({
    ignores: [
      'docs/src/components/ui/**/*.tsx',
    ],
  })
