import { defineConfig } from 'tsup'

import defaults from '../../tsup.config'

export default defineConfig({
  ...defaults,
  entry: [
    'src/index.ts',
    'src/sse.ts',
    'src/stdio.ts',
  ],
})
