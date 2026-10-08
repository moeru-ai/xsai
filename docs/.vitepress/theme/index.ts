import type { Theme } from 'vitepress'
import type { Component } from 'vue'

import './nolebase.css'
// eslint-disable-next-line perfectionist/sort-imports -- nolebase.css must evaluate before theme CSS so its layer is declared before the theme's utilities layer
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import { NolebaseGitChangelogPlugin } from '@nolebase/vitepress-plugin-git-changelog/client'
import { NolebaseInlineLinkPreviewPlugin } from '@nolebase/vitepress-plugin-inline-link-preview/client'
import { themeContextKey, VoidZeroTheme } from '@voidzero-dev/vitepress-theme'

import Home from './Home.vue'
import Layout from './Layout.vue'
import LegacyRedirect from './LegacyRedirect.vue'

import '@shikijs/vitepress-twoslash/style.css'
import './styles.css'

export default {
  ...VoidZeroTheme,
  enhanceApp: (ctx) => {
    ctx.app.provide(themeContextKey, {
      footerBg: '',
      logoAlt: 'xsAI',
      logoDark: 'https://github.com/moeru-ai.png',
      logoLight: 'https://github.com/moeru-ai.png',
      monoIcon: 'https://github.com/moeru-ai.png',
    })

    VoidZeroTheme.enhanceApp(ctx)

    ctx.app.component('Home', Home)
    ctx.app.component('LegacyRedirect', LegacyRedirect)
    ctx.app.use(TwoslashFloatingVue)
    ctx.app.use(NolebaseGitChangelogPlugin, { commitsRelativeTime: true })
    ctx.app.use(NolebaseInlineLinkPreviewPlugin)
  },
  Layout: Layout as Component,
} satisfies Theme
