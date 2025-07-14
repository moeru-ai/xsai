import { getGithubLastEdit } from 'fumadocs-core/server'
import { Popup, PopupContent, PopupTrigger } from 'fumadocs-twoslash/ui'
import { Tab, Tabs } from 'fumadocs-ui/components/tabs'
import defaultMdxComponents from 'fumadocs-ui/mdx'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { metadataImage } from '@/lib/metadata'
import { source } from '@/lib/source'

export const generateStaticParams = async () =>
  source.generateParams()

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>
}) => {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  return metadataImage.withImage(page.slugs, {
    description: page.data.description,
    metadataBase: new URL('https://xsai.js.org'),
    title: page.data.title,
  })
}

export default async (props: {
  params: Promise<{ slug?: string[] }>
}) => {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  const MDX = page.data.body

  const { owner, path, repo, sha } = {
    owner: 'moeru-ai',
    path: `docs/content/docs/${page.path}`,
    repo: 'xsai',
    sha: 'main',
  }

  const time = await getGithubLastEdit({ owner, path, repo })

  return (
    <DocsPage
      editOnGithub={{ owner, path, repo, sha }}
      full={page.data.full}
      lastUpdate={new Date(time ?? Date.now())}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{
          ...defaultMdxComponents,
          Popup,
          PopupContent,
          PopupTrigger,
          Tab,
          Tabs,
        }}
        />
      </DocsBody>
    </DocsPage>
  )
}
