// import * as path from 'node:path'
import { defineConfig } from 'rspress/config'

export default defineConfig({
  description: 'Extra-small AI SDK for any OpenAI-compatible API.',
  icon: 'https://github.com/moeru-ai.png',
  logo: 'https://github.com/moeru-ai.png',
  logoText: 'xsAI',
  outDir: 'dist',
  root: 'src',
  themeConfig: {
    enableScrollToTop: true,
    socialLinks: [
      {
        content: 'https://github.com/moeru-ai/xsai',
        icon: 'github',
        mode: 'link',
      },
    ],
  },
  title: 'xsAI',
})
