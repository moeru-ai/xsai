import { generateFiles, generateMDX } from 'fumadocs-typescript'
import * as fs from 'node:fs/promises'
import * as path from 'node:path'

void generateFiles({
  input: ['./content/docs/**/*.model.mdx'],
  // Rename x.model.mdx to x.mdx
  output: file =>
    path.resolve(
      path.dirname(file),
      `${path.basename(file).split('.')[0]}.mdx`,
    ),
})
