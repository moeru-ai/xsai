import { defineConfig } from 'bumpp'
import { globSync as glob } from 'node:fs'

export default defineConfig({
  files: glob('**/package.json'),
})
