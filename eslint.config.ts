import { GLOB_MARKDOWN, GLOB_MARKDOWN_CODE } from '@antfu/eslint-config'
import { defineConfig } from '@moeru/eslint-config'

export default defineConfig()
  .append({
    ignores: [
      '.scratch/**',
      'packages/text-responses/src/generated/**/*.ts',
      // Historical code uses the frozen API and formatting.
      'docs-v0/**/*.md/*',
      'docs-v0/.vitepress/theme/index.ts',
    ],
  })
  .append({
    rules: {
      'sonarjs/no-unused-vars': 'off',
    },
  })
  .append({
    files: [GLOB_MARKDOWN],
    rules: {
      'markdown/heading-increment': 'off',
    },
  })
  .append({
    files: [GLOB_MARKDOWN_CODE],
    rules: {
      // Twoslash preludes declare sample context before `// ---cut---`.
      'import/first': 'off',
    },
  })
