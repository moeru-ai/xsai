import { AuroraBackground } from '@/components/ui/aurora-background'
import Link from 'next/link'
import React from 'react'

export default () => (
  <AuroraBackground className="-mt-14">
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="text-fd-foreground mb-4 text-2xl font-bold">Hello World</h1>
      <p className="text-fd-muted-foreground">
        You can open
        {' '}
        <Link
          className="text-fd-foreground font-semibold underline"
          href="/docs"
        >
          /docs
        </Link>
        {' '}
        and see the documentation.
      </p>
    </main>
  </AuroraBackground>
)
