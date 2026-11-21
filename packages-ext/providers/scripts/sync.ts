import process from 'node:process'

import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'

import { extra } from '../src/corrections/extra'
import { overrides } from '../src/corrections/overrides'
import { CATALOG_URL } from '../src/fetch'
import { buildProviders, renderClient, renderFull, renderModels } from './codegen'

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

for (const [name, render] of [['models', renderModels], ['providers', renderClient]] as const) {
  const dir = new URL(`../src/${name}/`, import.meta.url)
  await rm(dir, { force: true, recursive: true })
  await mkdir(dir, { recursive: true })
  await Promise.all(providers.map(async provider =>
    writeFile(new URL(`${provider.id}.ts`, dir), render(provider))))
}
await writeFile(new URL('../src/full.ts', import.meta.url), renderFull(providers))

console.log(`Generated ${providers.length} providers with ${providers.reduce((sum, { models }) => sum + Object.keys(models).length, 0)} models.`)
