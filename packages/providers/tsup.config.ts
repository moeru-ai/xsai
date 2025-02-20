import { defineConfig } from 'tsup'

import { default as defaults } from '../../tsup.config'

export default defineConfig({
  ...defaults,
  entry: [
    'src/index.ts',
    'src/list.ts'
  ],
})