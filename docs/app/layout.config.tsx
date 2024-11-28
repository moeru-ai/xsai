import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared'

/**
 * Shared layout configurations
 *
 * you can configure layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
  githubUrl: 'https://github.com/moeru-ai/xsai',
  links: [
    {
      active: 'nested-url',
      text: 'Documentation',
      url: '/docs',
    },
  ],
  nav: {
    title: (
      <>
        <img className="size-6" src="https://github.com/moeru-ai.png" />
        <span>xsAI</span>
      </>
    ),
    transparentMode: 'top',
  },
}
