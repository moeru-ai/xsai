import { defineConfig } from '@moeru/eslint-config'

export default defineConfig({
  preferLet: false,
  typescript: { tsconfigPath: './tsconfig.json' },
})
  .append({
    ignores: [
      'docs/components/ui/**/*.tsx',
    ],
  })
