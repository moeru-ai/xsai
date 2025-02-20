import { resolve } from 'node:path'
import { defineConfig } from 'tsup'

export default defineConfig({
  dts: true,
  entry: ['src/index.ts'],
  format: 'esm',
  tsconfig: resolve(import.meta.dirname, 'tsconfig.lib.json'),
})
