import { generateFiles } from 'fumadocs-typescript'
import * as path from 'node:path'

// eslint-disable-next-line @masknet/no-top-level
void generateFiles({
  input: ['./content/docs/**/*.model.mdx'],
  // Rename x.model.mdx to x.mdx
  output: file =>
    path.resolve(
      path.dirname(file),
      `${path.basename(file).split('.')[0]}.mdx`,
    ),
})
