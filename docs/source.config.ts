import { remarkMermaid } from '@theguild/remark-mermaid'
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins'
import { remarkInstall } from 'fumadocs-docgen'
import { defineConfig, defineDocs } from 'fumadocs-mdx/config'
import { transformerTwoslash } from 'fumadocs-twoslash'

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
})

export default defineConfig({
  lastModifiedTime: 'git',
  mdxOptions: {
    rehypeCodeOptions: {
      inline: 'tailing-curly-colon',
      themes: {
        dark: 'one-dark-pro',
        light: 'one-light',
      },
      transformers: [
        ...(rehypeCodeDefaultOptions.transformers ?? []),
        transformerTwoslash(),
      ],
    },
    remarkPlugins: [
      [remarkInstall, { persist: { id: 'package-manager' } }],
      remarkMermaid,
    ],
  },
})
