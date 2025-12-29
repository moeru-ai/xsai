import type { MDXComponents } from 'mdx/types'

import defaultMdxComponents from 'fumadocs-ui/mdx'

import * as Twoslash from 'fumadocs-twoslash/ui'

// use this function to get MDX components, you will need it for rendering MDX
export const getMDXComponents = (components?: MDXComponents): MDXComponents => ({
  ...defaultMdxComponents,
  ...Twoslash,
  ...components,
})
