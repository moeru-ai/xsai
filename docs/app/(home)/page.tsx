import { BackgroundLines } from '@/components/ui/background-lines'
import { HoverBorderGradient } from '@/components/ui/hover-border-gradient'
import { Spotlight } from '@/components/ui/spotlight'
import Link from 'fumadocs-core/link'
import React from 'react'

export default () => (
  <BackgroundLines className="-mt-14 h-screen w-full rounded-md flex items-center justify-center relative overflow-hidden">
    <Spotlight fill="white" />
    <div className="flex flex-col items-center gap-8 p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0">
      <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-fd-foreground to-fd-muted-foreground bg-opacity-50">
        <small>extra-small</small>
        {' '}
        <span>AI SDK</span>
        <br />
        <small>for Browser, Node.js, Deno, Bun or Edge Runtime.</small>
      </h1>
      {/* <p className="mt-4 font-normal text-base text-muted-foreground max-w-lg text-center mx-auto">
        lorem ipsum
      </p> */}
      <HoverBorderGradient
        as="button"
        className="dark:bg-black bg-white text-black dark:text-white flex items-center space-x-2"
        containerClassName="rounded-full"
      >
        <Link href="/docs">Get Started</Link>
      </HoverBorderGradient>
    </div>
  </BackgroundLines>
)
