import type { Metadata } from 'next'

import { createRelativeLink } from 'fumadocs-ui/mdx'
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from 'fumadocs-ui/page'
import { notFound } from 'next/navigation'

import { source } from '@/lib/source'
import { getMDXComponents } from '@/mdx-components'

export const generateMetadata = async (props: {
  params: Promise<{ slug?: string[] }>
}): Promise<Metadata> => {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  const image = ['/docs-og', ...params.slug ?? [], 'image.png'].join('/')

  return {
    description: page.data.description,
    metadataBase: new URL('https://xsai.js.org'),
    openGraph: { images: image },
    title: page.data.title,
  }
}

export const generateStaticParams = async () =>
  source.generateParams()

const Page = async (props: {
  params: Promise<{ slug?: string[] }>
}) => {
  const params = await props.params
  const page = source.getPage(params.slug)
  if (!page)
    notFound()

  const MDXContent = page.data.body

  const { owner, path, repo, sha } = {
    owner: 'moeru-ai',
    path: `docs/content/docs/${page.path}`,
    repo: 'xsai',
    sha: 'main',
  }

  return (
    <DocsPage
      editOnGithub={{ owner, path, repo, sha }}
      full={page.data.full}
      toc={page.data.toc}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  )
}

export default Page
