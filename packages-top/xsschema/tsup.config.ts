import { defineConfig } from 'tsup'

import defaults from '../../tsup.config'

export default defineConfig({
  ...defaults,
  dts: {
    resolve: ['@standard-schema/spec', 'json-schema'],
  },
})
