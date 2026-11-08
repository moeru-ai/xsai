import process from 'node:process'

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

import { buildProviders, renderFull, renderProvider } from './codegen'
import { extra } from './extra'
import { overrides } from './overrides'

const CATALOG_URL = 'https://models.dev/experimental/v2.0/api.json?type=chat,decision,embedding,image,speech,transcription'

// Pass a local catalog path to skip the download.
const input = process.argv.at(2)
const catalog: unknown = input === undefined
  ? await fetch(CATALOG_URL).then(async (res) => {
      if (!res.ok)
        throw new Error(`Failed to fetch ${CATALOG_URL}: ${res.status}`)
      return res.json() as Promise<unknown>
    })
  : JSON.parse(await readFile(input, 'utf8'))

const providers = buildProviders(catalog, { extra, overrides })

const dir = new URL('../src/providers/', import.meta.url)
await rm(dir, { force: true, recursive: true })
await mkdir(dir, { recursive: true })
await Promise.all(providers.map(async provider =>
  writeFile(new URL(`${provider.id}.ts`, dir), renderProvider(provider))))
await writeFile(new URL('../src/full.ts', import.meta.url), renderFull(providers))

console.log(`Generated ${providers.length} providers with ${providers.reduce((sum, { models }) => sum + Object.keys(models).length, 0)} models.`)
