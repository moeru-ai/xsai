import 'fumadocs-twoslash/twoslash.css'

import './global.css'

import type { PropsWithChildren } from 'react'

// import Link from 'fumadocs-core/link'
// import { Banner } from 'fumadocs-ui/components/banner'
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
      {/* <Banner id="xsai-0.2" variant="rainbow">
        <Link href="https://blog.moeru.ai/xsai-0.2/">xsAI v0.2 is now available! Read Announcement</Link>
      </Banner> */}
      <RootProvider search={{ options: { type: 'static' } }}>
        {children}
      </RootProvider>
    </body>
  </html>
)
