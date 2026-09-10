import { GLOB_MARKDOWN } from '@antfu/eslint-config'
import { defineConfig } from '@moeru/eslint-config'

export default defineConfig()
  .append({
    ignores: [
      'packages/text-responses/src/generated/**/*.ts',
    ],
  })
  .append({
    files: [GLOB_MARKDOWN],
    rules: {
      'markdown/heading-increment': 'off',
    },
  })
