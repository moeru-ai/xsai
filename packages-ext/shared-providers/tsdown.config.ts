import { defineConfig } from 'tsdown'
import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  entry: 'src/index.ts',
  dts: {
    build: true,
    resolve: Object.keys(pkg.devDependencies)
  }
})
