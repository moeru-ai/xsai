import { createMDX } from 'fumadocs-mdx/next'

const withMDX = createMDX()

/** @type {import('next').NextConfig} */
const config = {
  distDir: 'dist',
  images: { unoptimized: true },
  output: 'export',
  reactStrictMode: true,
  /** @see {@link https://github.com/fuma-nama/fumadocs/issues/1450} */
  serverExternalPackages: ['oxc-transform'],
}

export default withMDX(config)
