import { generateOGImage } from 'fumadocs-ui/og'
import { notFound } from 'next/navigation'

import { source } from '@/lib/source'

export const generateStaticParams = () => source.generateParams().map(page => ({
  ...page,
  slug: [...page.slug, 'image.png'],
}))

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ slug: string[] }> },
) => {
  const { slug } = await params
  const page = source.getPage(slug.slice(0, -1))
  if (!page)
    notFound()

  return generateOGImage({
    description: page.data.description,
    icon: (<img height="64" src="https://github.com/moeru-ai.png" width="64" />),
    primaryColor: '#222',
    primaryTextColor: '#fff',
    site: 'xsAI',
    title: page.data.title,
  })
}
