import { readFile } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'

import { render } from 'takumi-js'
import { container, image, text } from 'takumi-js/helpers'

export interface OgCard {
  description?: string
  /** Path shown after the domain, such as `/text/generating`. */
  path: string
  /** Use `\n` to force a line break. */
  title: string
}

// Same zinc grays as theme/styles.css.
const ink = '#09090b'
const muted = '#71717a'
const line = '#e4e4e7'

/**
 * Outline of the Moeru AI logo, traced from its 32×32 pixel grid (the colored cells of the
 * original artwork), so the stroke follows the logo's own pixels.
 */
const logoPath = 'M13 0L15 0L15 1L16 1L16 2L19 2L19 3L20 3L20 5L19 5L19 6L17 6L17 8L16 8L16 9L18 9L18 10L19 10L19 13L18 13L18 14L17 14L17 16L16 16L16 17L15 17L15 19L14 19L14 22L15 22L15 20L16 20L16 18L17 18L17 17L18 17L18 15L19 15L19 14L20 14L20 13L21 13L21 12L25 12L25 13L26 13L26 14L27 14L27 16L28 16L28 18L29 18L29 20L30 20L30 22L31 22L31 25L32 25L32 31L31 31L31 32L26 32L26 31L25 31L25 27L24 27L24 24L23 24L23 22L22 22L22 24L21 24L21 25L22 25L22 26L23 26L23 29L22 29L22 30L20 30L20 31L19 31L19 32L14 32L14 31L13 31L13 25L14 25L14 22L13 22L13 24L12 24L12 25L8 25L8 24L7 24L7 22L6 22L6 23L1 23L1 22L0 22L0 13L1 13L1 12L2 12L2 11L7 11L7 12L8 12L8 20L9 20L9 18L10 18L10 11L11 11L11 10L12 10L12 9L13 9L13 8L12 8L12 7L9 7L9 9L8 9L8 10L5 10L5 9L4 9L4 8L1 8L1 7L0 7L0 5L1 5L1 4L4 4L4 2L5 2L5 1L8 1L8 2L9 2L9 3L12 3L12 1L13 1ZM15 13L14 13L14 15L13 15L13 16L14 16L14 17L15 17L15 16L16 16L16 15L15 15ZM3 15L3 16L5 16L5 15ZM3 18L3 19L5 19L5 18ZM8 20L7 20L7 21L8 21Z'
const logoSize = 380
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 -0.5 33 33"><path d="${logoPath}" fill="none" stroke="${line}" stroke-width="0.12" stroke-linejoin="miter"/></svg>`
const encodedLogo = encodeURIComponent(logoSvg)
const logo = `data:image/svg+xml,${encodedLogo}`

const width = 1200
const height = 630
const gutter = 64

const fontDir = resolve(dirname(createRequire(import.meta.url).resolve('@voidzero-dev/vitepress-theme/package.json')), 'src/fonts')

const cache: { fonts?: Promise<{ data: Uint8Array, name: string, weight: number }[]> } = {}
const loadFonts = async () => cache.fonts ??= Promise.all([
  ['APK Protocol', 'APK-Protocol-Medium.woff2', 500],
  ['Inter', 'inter-roman-latin.woff2', 400],
  ['KH Teka Mono', 'KHTekaMono-Regular.woff2', 400],
].map(async ([name, file, weight]) => ({
  data: new Uint8Array(await readFile(resolve(fontDir, file as string))),
  name: name as string,
  weight: weight as number,
})))

const mono = (content: string) => text(content, {
  color: muted,
  fontFamily: 'KH Teka Mono',
  fontSize: 22,
})

/** Renders a 1200×630 PNG for one page. */
export const renderOgCard = async ({ description, path, title }: OgCard) => {
  const titleSize = title.length > 32 ? 68 : title.length > 20 ? 80 : 112

  const node = container({
    children: [
      // The bordered column of the site wrapper.
      container({
        children: [
          container({
            children: [mono(`xsai.js.org${path === '/' ? '' : path}`)],
            style: { borderBottom: `1px solid ${line}`, display: 'flex', padding: `28px ${gutter - 16}px` },
          }),
          container({
            children: [
              container({
                children: [
                  text(title, {
                    color: ink,
                    fontFamily: 'APK Protocol',
                    fontSize: titleSize,
                    letterSpacing: '-0.045em',
                    lineHeight: 0.98,
                    whiteSpace: 'pre-line',
                  }),
                ],
                style: { maxWidth: 620 },
              }),
              ...description != null && description !== ''
                ? [text(description, {
                    color: muted,
                    fontFamily: 'Inter',
                    fontSize: 30,
                    lineClamp: 2,
                    lineHeight: 1.35,
                    marginTop: 28,
                    maxWidth: 640,
                  })]
                : [],
            ],
            style: { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'flex-end', padding: `0 ${gutter - 16}px 64px` },
          }),
          image({
            height: logoSize,
            src: logo,
            style: { position: 'absolute', right: 40, top: 140 },
            width: logoSize,
          }),
        ],
        style: {
          borderLeft: `1px solid ${line}`,
          borderRight: `1px solid ${line}`,
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
        },
      }),
    ],
    style: { backgroundColor: '#ffffff', display: 'flex', height: '100%', padding: `0 ${gutter - 32}px`, width: '100%' },
  })

  return render(node, { fonts: await loadFonts(), height, width })
}
