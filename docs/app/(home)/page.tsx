import Link from 'fumadocs-core/link'
import {
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page'
import React from 'react'

export default () => (
  <div className="flex w-full h-[80vh] justify-center">
    <div className="flex flex-col my-auto p-8">
      <DocsTitle>
        <small>extra-small</small>
        {' '}
        <span>AI SDK</span>
      </DocsTitle>
      <DocsDescription className="mb-2">for Browser, Node.js, Deno, Bun or Edge Runtime.</DocsDescription>
      <DocsBody>
        <Link href="/docs">Get Started</Link>
      </DocsBody>
    </div>
  </div>
)
