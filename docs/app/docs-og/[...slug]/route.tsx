import { metadataImage } from '@/lib/metadata'
import { generateOGImage } from 'fumadocs-ui/og'

export const GET = metadataImage.createAPI(page => generateOGImage({
  description: page.data.description,
  icon: (<img height="64" src="https://github.com/moeru-ai.png" width="64" />),
  primaryColor: '#222',
  primaryTextColor: '#fff',
  site: 'xsAI',
  title: page.data.title,
}))

export const generateStaticParams = () =>
  metadataImage.generateParams()
