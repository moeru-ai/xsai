import { defineConfig } from '@moeru/eslint-config'

export default defineConfig({
  typescript: { tsconfigPath: './tsconfig.json' },
})
  .append({
    ignores: [
      'docs/src/components/ui/**/*.tsx',
    ],
  })
