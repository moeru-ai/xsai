import 'fumadocs-twoslash/twoslash.css'

import './global.css'

import type { PropsWithChildren } from 'react'

import { RootProvider } from 'fumadocs-ui/provider'
import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
})

export default ({ children }: PropsWithChildren) => (
  <html className={inter.className} lang="en" suppressHydrationWarning>
    <head>
      <link href="https://github.com/moeru-ai.png" rel="icon" type="image/png" />
    </head>
    <body className="flex flex-col min-h-screen">
      <RootProvider>{children}</RootProvider>
    </body>
  </html>
)
