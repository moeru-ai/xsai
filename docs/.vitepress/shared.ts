import type { DefaultTheme, HeadConfig, MarkdownRenderer, SiteConfig, TransformContext } from 'vitepress'

import type { OgCard } from './og.ts'

import process from 'node:process'

import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import llmstxt from 'vitepress-plugin-llms'

import { GitChangelog, GitChangelogMarkdownSection } from '@nolebase/vitepress-plugin-git-changelog/vite'
import { InlineLinkPreviewElementTransform } from '@nolebase/vitepress-plugin-inline-link-preview/markdown-it'
import { transformHeadMeta } from '@nolebase/vitepress-plugin-meta/vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { extendConfig } from '@voidzero-dev/vitepress-theme/config'

import { renderOgCard } from './og.ts'

const currentSidebar: DefaultTheme.SidebarItem[] = [
  { items: [
    { link: '/introduction', text: 'Introduction' },
    { link: '/getting-started', text: 'Getting started' },
    { link: '/packages', text: 'Choose packages' },
    { link: '/ai', text: 'Working with AI' },
  ], text: 'Overview' },
  { items: [
    { link: '/text/generating', text: 'Generate text' },
    { link: '/text/streaming', text: 'Stream text' },
    { link: '/text/tools', text: 'Call tools' },
    { link: '/text/structured-output', text: 'Generate structured output' },
    { link: '/text/messages', text: 'Messages and Parts' },
    { link: '/text/events', text: 'Text events' },
    { link: '/text/adapters', text: 'Choose an adapter' },
    { link: '/text/troubleshooting', text: 'Troubleshoot requests' },
    { link: '/text/api', text: 'Text API reference' },
  ], text: 'Core Concepts' },
  { items: [
    { link: '/audio', text: 'Audio' },
    { link: '/decide', text: 'Decisions' },
    { link: '/embed', text: 'Embeddings' },
    { link: '/image', text: 'Images' },
    { link: '/model', text: 'Models' },
  ], text: 'More Capabilities' },
  { items: [
    { link: '/advanced/custom-models', text: 'Write a custom model' },
    { link: '/advanced/module-augmentation', text: 'Module augmentation' },
  ], text: 'Advanced' },
  { items: [
    { link: '/shared', text: 'shared' },
    { link: '/xsschema', text: 'xsschema' },
  ], text: 'Extras' },
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

const site = 'https://xsai.js.org'

// Open Graph cards, one per page: collected while rendering heads, drawn once the build ends.
const ogCards = new Map<string, OgCard>()

const decode = (html: string) => html
  .split('<')
  .map((part, i) => i === 0 ? part : part.slice(part.indexOf('>') + 1))
  .join('')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, '\'')
  .replace(/&amp;/g, '&')
  .trim()

/** The first sentence reads as a summary; a clamped paragraph would stop mid-sentence. */
const firstSentence = (text: string) => {
  const end = text.indexOf('. ')
  return end === -1 ? text : text.slice(0, end + 1)
}

const ogHead = ({ content, page, pageData }: TransformContext): HeadConfig[] => {
  if (pageData.filePath.startsWith('legacy/') || page === '404.md')
    return []
  const slug = page.replace(/(?:^|\/)index\.md$/, '').replace(/\.md$/, '')
  const file = `og/${slug || 'index'}.png`
  const home = pageData.frontmatter.layout === 'home'
  const start = content.indexOf('<p>')
  const paragraph = start === -1 ? undefined : content.slice(start + 3, content.indexOf('</p>', start))
  ogCards.set(file, {
    // VitePress sets an empty description when the page has none, so fall back to the first paragraph.
    description: home
      ? 'One shape for every model. Web standards, nothing else.'
      : [pageData.frontmatter.description as string | undefined, pageData.description, paragraph == null ? undefined : firstSentence(decode(paragraph))]
          .find(text => text != null && text !== ''),
    path: `/${slug}`,
    title: home ? 'AI SDK,\nextra small.' : pageData.title,
  })
  const image = `${site}/${file}`
  return [
    ['meta', { content: image, property: 'og:image' }],
    ['meta', { content: '1200', property: 'og:image:width' }],
    ['meta', { content: '630', property: 'og:image:height' }],
    ['meta', { content: 'summary_large_image', name: 'twitter:card' }],
    ['meta', { content: image, name: 'twitter:image' }],
  ]
}

const renderOgCards = async ({ outDir }: SiteConfig) => {
  await Promise.all([...ogCards].map(async ([file, card]) => {
    const path = resolve(outDir, file)
    await mkdir(dirname(path), { recursive: true })
    await writeFile(path, await renderOgCard(card))
  }))
}

export const createDocsConfig = (archive: boolean) => {
  const srcExclude = ['adr/**', 'agents/**', 'research/**', 'snippets/**', 'CONTRIBUTING.md', 'out/**']
  return extendConfig({
    base: archive ? '/v0/' : '/',
    buildEnd: archive ? normalizeArchiveExports : renderOgCards,
    cleanUrls: true,
    description: archive ? 'xsAI v0 API archive from v0.5.1.' : 'Build AI applications with small, composable packages.',
    head: [['link', { href: 'https://github.com/moeru-ai.png', rel: 'icon', type: 'image/png' }]],
    markdown: {
      codeTransformers: archive ? [] : [transformerTwoslash({ explicitTrigger: false, twoslashOptions: { compilerOptions: { types: ['node'] } } })],
      config: (md: MarkdownRenderer) => md.use(InlineLinkPreviewElementTransform),
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
        ...archive
          ? []
          : [{
              items: [
                { link: '/text/generating', text: 'Text' },
                { link: '/audio', text: 'Audio' },
                { link: '/decide', text: 'Decide' },
                { link: '/embed', text: 'Embed' },
                { link: '/image', text: 'Image' },
                { link: '/model', text: 'Models' },
              ],
              text: 'Features',
            }],
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
    transformHead: async (context: TransformContext) => [
      ...await transformHeadMeta()([...context.head], context) ?? [],
      ...archive ? [] : ogHead(context),
    ],
    vite: {
      optimizeDeps: { exclude: ['@nolebase/vitepress-plugin-inline-link-preview/client'] },
      plugins: [
        llmstxt({ excludeIndexPage: false, ignoreFiles: [...srcExclude, 'legacy/**'] }),
        GitChangelog({
          include: ['**/*.md', '!{adr,agents,legacy,out,research,snippets}/**', '!CONTRIBUTING.md'],
          repoURL: () => 'https://github.com/moeru-ai/xsai',
        }),
        ...archive ? [] : [GitChangelogMarkdownSection({ exclude: id => id.includes('/legacy/') })],
      ],
      server: { port: Number.parseInt(process.env.TURBO_MFE_PORT ?? (archive ? '5174' : '5173'), 10), strictPort: true },
      ssr: {
        noExternal: [
          '@nolebase/vitepress-plugin-git-changelog',
          '@nolebase/vitepress-plugin-highlight-targeted-heading',
          '@nolebase/vitepress-plugin-inline-link-preview',
        ],
      },
    },
  })
}
