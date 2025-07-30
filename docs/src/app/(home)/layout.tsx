import type { PropsWithChildren } from 'react'

import { HomeLayout } from 'fumadocs-ui/layouts/home'

import { baseOptions } from '@/app/layout.config'

const Layout = ({ children }: PropsWithChildren) => (
  <HomeLayout
    {...baseOptions}
    links={[
      {
        active: 'nested-url',
        text: 'Docs',
        url: '/docs',
      },
      {
        active: 'none',
        text: 'Blog',
        url: 'https://blog.moeru.ai',
      },
    ]}
  >
    {children}
  </HomeLayout>
)

export default Layout
