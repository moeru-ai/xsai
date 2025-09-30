import { camelCase, pascalCase } from 'scule'

import type { CodeGenProvider } from './types'

/** code gen for '@xsai-ext/providers/create' */
export const codeGenCreate = (provider: CodeGenProvider) => [
  '/**',
  ` * Create a ${provider.name} Provider`,
  ` * @see {@link ${provider.doc}}`,
  ' */',
  `export const create${pascalCase(provider.id)} = (apiKey: string, baseURL = '${provider.baseURL}') => merge(`,
  `  createChatProvider<'${provider.models.join('\' | \'')}'>({ apiKey, baseURL }),`,
  '  createModelProvider({ apiKey, baseURL }),',
  ')',
].join('\n')

/** code gen for '@xsai-ext/providers' */
export const codeGenIndex = (provider: CodeGenProvider) => ({
  ex: [
    '/**',
    ` * ${provider.name} Provider`,
    ` * @see {@link ${provider.doc}}`,
    ' * @remarks',
    ` * baseURL - \`${provider.baseURL}\``,
    ` * apiKey - \`import('node:process').env.${provider.apiKey}\``,
    ' */',
    `export const ${camelCase(provider.id)} = create${pascalCase(provider.id)}(process.env.${provider.apiKey}!)`,
  ].join('\n'),
  im: `create${pascalCase(provider.id)}`,
})
