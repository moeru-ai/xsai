import { loader } from 'fumadocs-core/source'
import { icons } from 'lucide-react'
import { createElement } from 'react'

import { docs } from '@/.source'

export const source = loader({
  baseUrl: '/docs',
  icon: (icon) => {
    if (icon == null)
      return

    if (icon in icons)
      return createElement(icons[icon as keyof typeof icons])
  },
  source: docs.toFumadocsSource(),
})
