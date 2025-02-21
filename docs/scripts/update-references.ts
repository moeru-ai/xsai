/* eslint-disable @masknet/no-top-level */
import { findWorkspaceDir } from '@pnpm/find-workspace-dir'
import { glob, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd } from 'node:process'

const pages = []

const workspaceDir = await findWorkspaceDir(cwd())

const packagesExt = glob(`${workspaceDir}/packages-ext/**/package.json`)

for await (const pkg of packagesExt) {
  const { name } = JSON.parse(await readFile(pkg, 'utf8')) as { name: string }
  pages.push(`[${name}](https://tsdocs.dev/search/docs/${name})`)
}

const packages = glob(`${workspaceDir}/packages/**/package.json`)

for await (const pkg of packages) {
  const { name } = JSON.parse(await readFile(pkg, 'utf8')) as { name: string }
  pages.push(`[${name}](https://tsdocs.dev/search/docs/${name})`)
}

const json = JSON.stringify({
  defaultOpen: true,
  pages: pages.toReversed(),
  title: 'References',
}, null, 2)

await writeFile(resolve(import.meta.dirname, '../content/docs/references/meta.json'), `${json}\n`)
