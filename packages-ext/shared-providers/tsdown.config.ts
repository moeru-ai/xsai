import { defineConfig } from 'tsdown'

import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  dts: {
    build: true,
    resolve: Object.keys(pkg.devDependencies),
  },
  entry: 'src/index.ts',
})
