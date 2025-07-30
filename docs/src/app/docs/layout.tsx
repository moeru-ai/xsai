import type { PropsWithChildren } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions } from '@/app/layout.config'
import { source } from '@/lib/source'

const options = { ...baseOptions, links: [] }

export default ({ children }: PropsWithChildren) => (
  <DocsLayout tree={source.pageTree} {...options}>
    {children}
  </DocsLayout>
)
