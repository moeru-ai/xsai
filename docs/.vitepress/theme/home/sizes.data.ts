import { readdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { gzipSync } from 'node:zlib'

import { build } from 'rolldown'
import { defineLoader } from 'vitepress'

export interface PackageSize {
  /** Gzipped bytes of the minified bundle, without the package's dependencies. */
  bytes: number
  dependencies: string[]
  name: string
}

export interface PackageSizes {
  packages: PackageSize[]
  /** Gzipped bytes of `xsai` with every workspace dependency bundled in. */
  total: number
}

declare const data: PackageSizes
export { data }

const root = resolve(import.meta.dirname, '../../../../packages')

const measure = async (input: string, external: (id: string) => boolean) => {
  const { output } = await build({
    external,
    input,
    logLevel: 'silent',
    output: { minify: true },
    write: false,
  })
  return output.reduce((sum, chunk) =>
    sum + (chunk.type === 'chunk' ? gzipSync(chunk.code, { level: 9 }).byteLength : 0), 0)
}

const isBare = (id: string) => !id.startsWith('.') && !id.startsWith('/') && !id.startsWith('\0')

const packageName = (id: string) => id.split('/').slice(0, id.startsWith('@') ? 2 : 1).join('/')

export default defineLoader({
  load: async (): Promise<PackageSizes> => {
    const dirs = await readdir(root)
    const manifests = await Promise.all(dirs.map(async dir => ({
      dir,
      manifest: JSON.parse(await readFile(resolve(root, dir, 'package.json'), 'utf8')) as {
        dependencies?: Record<string, string>
        name: string
        peerDependencies?: Record<string, string>
      },
    })))
    const workspace = new Set(manifests.map(({ manifest }) => manifest.name))

    // Only `xsai` and the packages it re-exports. Standalone packages such as `xsschema` are not part of the total.
    const xsai = manifests.find(({ manifest }) => manifest.name === 'xsai')!
    const included = new Set(['xsai', ...Object.keys(xsai.manifest.dependencies ?? {})])

    const packages = await Promise.all(manifests.filter(({ manifest }) => included.has(manifest.name)).map(async ({ dir, manifest }) => ({
      bytes: await measure(resolve(root, dir, 'src/index.ts'), isBare),
      dependencies: Object.keys({ ...manifest.dependencies, ...manifest.peerDependencies })
        .filter(name => workspace.has(name)),
      name: manifest.name,
    })))

    // Bundle workspace packages into `xsai` to get the full install size.
    const total = await measure(resolve(root, 'xsai/src/index.ts'), id =>
      isBare(id) && !workspace.has(packageName(id)))

    return { packages: packages.toSorted((a, b) => a.name.localeCompare(b.name)), total }
  },
  watch: ['../../../../packages/*/src/**/*.ts'],
})
