import { GLOB_MARKDOWN_CODE, GLOB_TESTS } from '@antfu/eslint-config'
import { defineConfig } from '@importantimport/eslint-config'

export default defineConfig({
  typescript: { tsconfigPath: './tsconfig.json' },
}, [{
  ignores: [
    'docs/components/ui/**/*.tsx',
    'packages-ext/*/example/*.tsx',
    'packages-ext/*/example/*.jsx',
  ],
}, {
  rules: {
    '@masknet/no-default-error': 'off',
    '@masknet/no-then': 'off',
    'sonarjs/todo-tag': 'warn',
  },
}, {
  files: [...GLOB_TESTS, GLOB_MARKDOWN_CODE],
  rules: {
    '@masknet/no-top-level': 'off',
    '@masknet/unicode-specific-set': 'off',
  },
}, {
  ignores: [
    'cspell.config.yaml',
    'cspell.config.yml',
  ],
}])
