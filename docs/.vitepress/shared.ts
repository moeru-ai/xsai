import type { DefaultTheme, SiteConfig } from 'vitepress'

import process from 'node:process'

import { readdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

import llmstxt from 'vitepress-plugin-llms'

import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'

const currentSidebar: DefaultTheme.SidebarItem[] = [
  { items: [
    { link: '/', text: 'Introduction' },
    { link: '/text/quick-start', text: 'Quick start' },
    { link: '/text/adapters', text: 'Choose an adapter' },
    { link: '/guide/xsai', text: 'Choose packages' },
    { link: '/guide/ai', text: 'Working with AI' },
  ], text: 'Getting Started' },
  { items: [
    { link: '/text/streaming', text: 'Stream text' },
    { link: '/text/tools', text: 'Call tools' },
    { link: '/text/structured-output', text: 'Generate structured output' },
    { link: '/text/messages-quick-start', text: 'Use Anthropic Messages' },
    { link: '/text/responses-quick-start', text: 'Use OpenAI Responses' },
    { link: '/audio/quick-start', text: 'Speech and transcription' },
    { link: '/embed/quick-start', text: 'Create embeddings' },
    { link: '/image/quick-start', text: 'Generate images' },
    { link: '/model/quick-start', text: 'List models' },
    { link: '/xsschema/quick-start', text: 'Convert and validate schemas' },
  ], text: 'Guides' },
  { items: [
    { link: '/text/cancellation', text: 'Cancel requests' },
    { link: '/text/loop-control', text: 'Control tool loop steps' },
    { link: '/text/event-target', text: 'Use event listeners' },
    { link: '/text/custom-models', text: 'Write a custom model' },
    { link: '/shared/quick-start', text: 'Handle HTTP errors' },
    { link: '/text/troubleshooting', text: 'Troubleshooting' },
  ], text: 'Advanced' },
  { items: [
    { link: '/text/api', text: 'Text' },
    { link: '/text/events', text: 'Text events' },
    { link: '/audio/api', text: 'Audio' },
    { link: '/embed/api', text: 'Embeddings' },
    { link: '/image/api', text: 'Images' },
    { link: '/model/api', text: 'Models' },
    { link: '/shared/api', text: 'Shared HTTP helpers' },
    { link: '/xsschema/api', text: 'xsschema' },
  ], text: 'References' },
]

const archiveSidebar: DefaultTheme.SidebarItem[] = [
  { items: [
    { link: '/', text: 'v0 overview' },
    { link: '/packages/overview', text: 'Packages' },
  ], text: 'Start' },
  { items: ['text', 'object', 'image', 'speech', 'transcription'].map(name => ({ link: `/packages/generate/${name}`, text: name })), text: 'Generate' },
  { items: ['text', 'object', 'speech', 'transcription'].map(name => ({ link: `/packages/stream/${name}`, text: name })), text: 'Stream' },
  { items: ['embed', 'model', 'tool'].map(name => ({ link: `/packages/${name}`, text: name })), text: 'Other packages' },
  { items: ['chat', 'reasoning', 'stream'].map(name => ({ link: `/packages/utils/${name}`, text: name })), text: 'Utilities' },
  { items: ['xsai', 'xsfetch', 'xsschema'].map(name => ({ link: `/packages-top/${name}`, text: name })), text: 'Top-level packages' },
  { items: ['providers', 'responses', 'telemetry'].map(name => ({ link: `/packages-ext/${name}`, text: name })), text: 'Extensions' },
  { items: [
    { link: '/integrations/tools/composio', text: 'Composio' },
    { link: '/integrations/tools/model-context-protocol', text: 'Model Context Protocol' },
  ], text: 'Integrations' },
]

const normalizeArchiveExports = async ({ outDir }: SiteConfig) => {
  // VitePress adds the base to HTML links. The LLM plugin keeps source links.
  for (const file of await readdir(outDir, { recursive: true })) {
    if (!file.endsWith('.md') && file !== 'llms-full.txt')
      continue
    const path = resolve(outDir, file)
    const content = await readFile(path, 'utf8')
    const body = content.replace(/\]\((\/(?!v0\/)[^)]*)\)/g, (_, link: string) =>
      `](${link === '/../' ? 'https://xsai.js.org/' : `/v0${link}`})`)
    await writeFile(path, body)
  }
}

export const createDocsConfig = (archive: boolean) => {
  const srcExclude = ['adr/**', 'agents/**', 'research/**', 'CONTRIBUTING.md', 'out/**']
  return extendConfig({
    base: archive ? '/v0/' : '/',
    buildEnd: archive ? normalizeArchiveExports : undefined,
    cleanUrls: true,
    description: archive ? 'xsAI v0 API archive from v0.5.1.' : 'Build AI applications with small, composable packages.',
    head: [['link', { href: 'https://github.com/moeru-ai.png', rel: 'icon', type: 'image/png' }]],
    markdown: {
      codeTransformers: archive ? [] : [transformerTwoslash({ twoslashOptions: { compilerOptions: { types: ['node'] } } })],
      languages: ['js', 'jsx', 'ts', 'tsx', 'sh', 'bash', 'shell', 'json'],
    },
    rewrites: archive ? {} : { 'legacy/:path*.md': 'docs/:path*.md', 'legacy/index.md': 'docs/index.md' },
    srcExclude,
    themeConfig: {
      editLink: {
        pattern: `https://github.com/moeru-ai/xsai/edit/main/${archive ? 'docs-v0' : 'docs'}/:path`,
        text: 'Suggest changes to this page',
      },
      nav: [
        {
          link: 'https://blog.moeru.ai',
          text: 'Blog',
        },
        {
          items: [{
            link: 'https://github.com/moeru-ai/xsai/blob/main/CONTRIBUTING.md',
            text: 'Contributing',
          }, archive
            ? { link: '/../', target: '_self', text: 'v1 Docs' }
            : { link: '/v0/', target: '_self', text: 'v0 Docs' }],
          text: archive ? 'v0' : 'v1',
        },
      ],
      search: archive ? undefined : { provider: 'local' },
      sidebar: archive ? archiveSidebar : currentSidebar,
      socialLinks: [
        { icon: 'x', link: 'https://x.com/moeru_ai' },
        { icon: 'mastodon', link: 'https://mastodon.social/@moeru_ai' },
        { icon: 'bluesky', link: 'https://bsky.app/profile/moeru-ai.bsky.social' },
        { icon: 'github', link: 'https://github.com/moeru-ai/xsai' },
      ],
      variant: 'voidzero',
    },
    title: archive ? 'xsAI v0' : 'xsAI',
    vite: { plugins: [llmstxt({ excludeIndexPage: false, ignoreFiles: [...srcExclude, 'legacy/**'] })], server: { port: Number.parseInt(process.env.TURBO_MFE_PORT ?? (archive ? '5174' : '5173'), 10), strictPort: true } },
  })
}
