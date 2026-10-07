import llmstxt from 'vitepress-plugin-llms'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'

const srcExclude = ['adr/**', 'agents/**', 'research/**']

export default extendConfig({
  description: 'extra-small AI SDK.',
  head: [['link', { href: 'https://github.com/moeru-ai.png', rel: 'icon', type: 'image/png' }]],
  markdown: {
    codeTransformers: [
      transformerTwoslash({
        twoslashOptions: {
          compilerOptions: {
            types: ['node'],
          },
        },
      }),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx', 'sh', 'bash', 'shell'],
  },
  srcExclude,
  themeConfig: {
    nav: [],
    search: { provider: 'local' },
    sidebar: [],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/moeru-ai/xsai' },
    ],
    variant: 'voidzero',
  },
  title: 'xsAI',
  vite: {
    plugins: [llmstxt({ excludeIndexPage: false, ignoreFiles: srcExclude })],
  },
})
