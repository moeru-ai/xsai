import type { Theme } from 'vitepress'
import type { Component } from 'vue'

import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

import { themeContextKey, VoidZeroTheme } from '@voidzero-dev/vitepress-theme'

import Home from './Home.vue'
import Layout from './Layout.vue'

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
    ctx.app.use(TwoslashFloatingVue)
  },
  Layout: Layout as Component,
} satisfies Theme
