import type { MDXComponents } from 'mdx/types'

import * as Twoslash from 'fumadocs-twoslash/ui'
import defaultMdxComponents from 'fumadocs-ui/mdx'

// use this function to get MDX components, you will need it for rendering MDX
export const getMDXComponents = (components?: MDXComponents): MDXComponents => ({
  ...defaultMdxComponents,
  ...Twoslash,
  ...components,
})
