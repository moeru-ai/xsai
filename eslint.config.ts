// import { defineConfig } from '@importantimport/eslint-config'

// export default defineConfig({
//   typescript: { tsconfigPath: './tsconfig.json' },
// })

import antfu, { GLOB_MARKDOWN_CODE, GLOB_TESTS } from '@antfu/eslint-config'
import { ii } from '@importantimport/eslint-config'

export default antfu({ typescript: { tsconfigPath: './tsconfig.json' } })
  .append(ii({ typescript: { tsconfigPath: './tsconfig.json' } }))
  .append({
    ignores: [
      'docs/components/ui/**/*.tsx',
    ],
  })
  .append({
    rules: {
      '@masknet/no-default-error': 'off',
      '@masknet/no-then': 'off',
      'sonarjs/todo-tag': 'warn',
    },
  })
  .append({
    files: [...GLOB_TESTS, GLOB_MARKDOWN_CODE],
    rules: {
      '@masknet/no-top-level': 'off',
      '@masknet/unicode-specific-set': 'off',
    },
  })
  .append({
    ignores: [
      'cspell.config.yaml',
      'cspell.config.yml',
    ],
  })
