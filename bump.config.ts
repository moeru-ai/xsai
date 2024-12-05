import { defineConfig } from 'bumpp'
import { globSync as glob } from 'node:fs'

export default defineConfig({
  all: true,
  files: glob('**/package.json'),
  push: false,
})
