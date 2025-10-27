import { writeFile } from 'node:fs/promises'

import type { CodeGenProvider, Providers } from './utils/types'

import { codeGenCreate, codeGenIndex, codeGenTypes } from './utils/code-gen'
import { processOpenAICompatible, toCodeGenProvider, toCodeGenProviderForce } from './utils/process'

const providers = await fetch('https://models.dev/api.json')
  .then(async res => res.json() as Promise<Providers>)
  .then(ps => Object.values(ps))

const [autoProviders, manualProviders] = processOpenAICompatible(providers)
  .reduce(([auto, manual], provider) => {
    if (['openrouter'].includes(provider.id))
      manual.push(provider)
    else
      auto.push(provider)

    return [auto, manual]
  }, [[], []] as [CodeGenProvider[], CodeGenProvider[]])

const forceAutoProviders = [
  // toCodeGenProviderForce(providers, 'cohere', 'https://api.cohere.ai/compatibility/v1/', 'https://docs.cohere.com/docs/compatibility-api', true),
  toCodeGenProviderForce(providers, 'deepinfra', 'https://api.deepinfra.com/v1/openai/', 'https://deepinfra.com/docs/openai_api', true),
  toCodeGenProviderForce(providers, 'groq', 'https://api.groq.com/openai/v1/', 'https://console.groq.com/docs/openai'),
  toCodeGenProviderForce(providers, 'mistral', 'https://api.mistral.ai/v1/', undefined, true),
]

const forceManualProviders = providers
  .filter(p => ['anthropic', 'cerebras', 'deepinfra', 'google'].includes(p.id))
  .map(toCodeGenProvider)

autoProviders.push(...forceAutoProviders)
manualProviders.push(...forceManualProviders)

const create = [
  [
    '/* eslint-disable perfectionist/sort-union-types */',
    '/* eslint-disable sonarjs/no-identical-functions */',
    '/* eslint-disable sonarjs/use-type-alias */',
  ].join('\n'),
  'import { createChatProvider, createEmbedProvider, createModelProvider, merge } from \'@xsai-ext/shared-providers\'',
  ...autoProviders.map(codeGenCreate),
].join('\n\n')

await writeFile('./src/generated/create.ts', `${create}\n`, { encoding: 'utf8' })

const creates = autoProviders
  .filter(p => p.apiKey != null)
  .map(codeGenIndex)
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

const types = [
  '/* eslint-disable perfectionist/sort-modules */',
  '/* eslint-disable perfectionist/sort-union-types */',
  ...manualProviders.map(codeGenTypes),
]
  .join('\n\n')

await writeFile('./src/generated/types.ts', `${types}\n`, { encoding: 'utf8' })
