import { metadataImage } from '@/lib/metadata'
import { generateOGImage } from 'fumadocs-ui/og'

export const GET = metadataImage.createAPI(page => generateOGImage({
  description: page.data.description,
  site: 'My App',
  title: page.data.title,
}))

export const generateStaticParams = () =>
  metadataImage.generateParams()
