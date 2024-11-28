import type { PropsWithChildren } from 'react'

import { baseOptions } from '@/app/layout.config'
import { HomeLayout } from 'fumadocs-ui/layouts/home'

export default ({ children }: PropsWithChildren) =>
  (<HomeLayout {...baseOptions}>{children}</HomeLayout>)
