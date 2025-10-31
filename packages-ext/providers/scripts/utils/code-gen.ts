import { camelCase, pascalCase } from 'scule'

import type { CodeGenProvider } from './types'

const codeGenConstCreate = (provider: CodeGenProvider) => `create${provider.overrides?.create ?? pascalCase(provider.id)}`

const codeGenConstEntry = (provider: CodeGenProvider) => provider.overrides?.id ?? camelCase(provider.id)

/** code gen for '@xsai-ext/providers/create' */
export const codeGenCreate = (provider: CodeGenProvider) => [
  '/**',
  ` * Create a ${provider.name} Provider`,
  ` * @see {@link ${provider.doc}}`,
  ' */',
  `export const ${codeGenConstCreate(provider)} = (apiKey: string, baseURL = '${provider.baseURL}') => merge(`,
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  `  createChatProvider${provider.models.length > 0 ? `<'${provider.models.join('\' | \'')}'>` : ''}({ apiKey, baseURL }),`,
  ...(provider.capabilities?.model === false ? [] : ['  createModelProvider({ apiKey, baseURL }),']),
  ...(provider.capabilities?.embed === true ? ['  createEmbedProvider({ apiKey, baseURL }),'] : []),
  ...(provider.capabilities?.speech === true ? ['  createSpeechProvider({ apiKey, baseURL }),'] : []),
  ...(provider.capabilities?.transcription === true ? ['  createTranscriptionProvider({ apiKey, baseURL }),'] : []),
  ')',
].join('\n')

/** code gen for '@xsai-ext/providers' */
export const codeGenIndex = (provider: CodeGenProvider) => {
  const create = codeGenConstCreate(provider)

  return {
    ex: [
      '/**',
      ` * ${provider.name} Provider`,
      ` * @see {@link ${provider.doc}}`,
      ' * @remarks',
      ` * - baseURL - \`${provider.baseURL}\``,
      ` * - apiKey - \`${provider.apiKey}\``,
      ' */',
      `export const ${codeGenConstEntry(provider)} = ${create}(process.env.${provider.apiKey}!)`,
    ].join('\n'),
    im: create,
  }
}

/** code gen for internal use */
export const codeGenTypes = (provider: CodeGenProvider) => `export type ${pascalCase(provider.id)}Models = '${provider.models.join('\' | \'')}'`
