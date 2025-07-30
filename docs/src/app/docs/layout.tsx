import type { PropsWithChildren } from 'react'

import { DocsLayout } from 'fumadocs-ui/layouts/docs'

import { baseOptions } from '@/app/layout.config'
import { source } from '@/lib/source'

const Layout = ({ children }: PropsWithChildren) => (
  <DocsLayout tree={source.pageTree} {...baseOptions}>
    {children}
  </DocsLayout>
)

export default Layout
