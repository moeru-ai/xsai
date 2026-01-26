import { defineConfig } from '@hey-api/openapi-ts'

const removeDiscriminator = (data: unknown): unknown => {
  if (Array.isArray(data))
    return data.map(removeDiscriminator)

  if (data !== null && typeof data === 'object') {
    return Object.entries(data).reduce((acc, [key, value]) => {
      if (key !== 'discriminator') {
        acc[key] = removeDiscriminator(value)
      }
      return acc
    }, {} as Record<string, unknown>)
  }

  return data
}

const path = await fetch('https://www.openresponses.org/openapi/openapi.json')
  .then(async res => res.json())
  .then(removeDiscriminator)

export default defineConfig({
  input: { path },
  output: {
    path: 'src/generated',
    postProcess: ['eslint', 'oxlint'],
  },
  plugins: ['@hey-api/typescript'],
})
