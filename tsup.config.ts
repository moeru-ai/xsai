import { findWorkspaceDir } from '@pnpm/find-workspace-dir'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { defineConfig } from 'tsup'

const workspaceDir = await findWorkspaceDir(cwd())

export default defineConfig({
  dts: true,
  entry: ['src/index.ts'],
  format: 'esm',
  tsconfig: resolve(workspaceDir!, 'tsconfig.lib.json'),
})
