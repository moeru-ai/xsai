import { writeFile } from 'node:fs/promises'

import type { Providers } from './utils/types'

import { codeGenCreate, codeGenIndex } from './utils/code-gen'
import { processOpenAICompatible } from './utils/process-openai-compatible'

const providers = await fetch('https://models.dev/api.json')
  .then(async res => res.json()) as Providers

const codeGenProviders = processOpenAICompatible(Object.values(providers))

const create = [
  [
    '/* eslint-disable perfectionist/sort-union-types */',
    '/* eslint-disable sonarjs/no-identical-functions */',
    '/* eslint-disable sonarjs/use-type-alias */',
  ].join('\n'),
  'import { createChatProvider, createModelProvider, merge } from \'@xsai-ext/shared-providers\'',
  ...codeGenProviders.map(p => codeGenCreate(p)),
].join('\n\n')

await writeFile('./src/generated/create.ts', `${create}\n`, { encoding: 'utf8' })

const creates = codeGenProviders
  .filter(p => p.apiKey != null)
  .map(p => codeGenIndex(p))
const imp = creates.map(({ im }) => im)
const exp = creates.map(({ ex }) => ex)

const index = [
  '/* eslint-disable perfectionist/sort-named-imports */',
  'import process from \'node:process\'',
  [
    'import {',
    imp.map(str => `  ${str},`).join('\n'),
    '} from \'./create\'',
  ].join('\n'),
  ...exp,
].join('\n\n')

await writeFile('./src/generated/index.ts', `${index}\n`, { encoding: 'utf8' })
