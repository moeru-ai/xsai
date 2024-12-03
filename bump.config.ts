import { defineConfig } from 'bumpp'
import { globSync } from 'tinyglobby'

export default defineConfig({
  files: globSync('**/package.json'),
})
