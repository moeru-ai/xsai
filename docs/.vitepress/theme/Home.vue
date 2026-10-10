<script setup lang="ts">
import HeroStream from './home/HeroStream.vue'
import InstallTabs from './home/InstallTabs.vue'
import ProtocolSwitch from './home/ProtocolSwitch.vue'
import SizeBar from './home/SizeBar.vue'
import { data as sizes } from './home/sizes.data'

const total = `${(sizes.total / 1000).toFixed(1)} KB`

const runtimes = ['Node.js', 'Deno', 'Bun', 'Cloudflare Workers', 'Browsers']
</script>

<template>
  <main class="home wrapper border-b border-line">
    <section class="grid grid-cols-[minmax(0,1fr)] gap-8 px-5 pt-12 pb-10 md:px-8 md:pt-20 md:pb-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
      <h1 class="home-title">
        AI SDK,<br>extra small.
      </h1>
      <div class="lg:pb-3">
        <p class="home-lede">
          One shape for every model. Web standards, nothing else.
        </p>
        <p class="mt-3 mb-0 text-muted">
          {{ total }} gzipped with every package included. Install only what you use.
        </p>
        <div class="mt-7 flex flex-wrap items-center gap-3">
          <a class="button button--primary" href="/getting-started">Get started</a>
          <a class="home-link" href="https://github.com/moeru-ai/xsai">View on GitHub</a>
        </div>
      </div>
    </section>

    <HeroStream>
      <slot name="hero" />
    </HeroStream>

    <section class="home-section">
      <header class="home-section-head">
        <h2>One shape, three protocols.</h2>
        <p>
          A model belongs to a protocol, not to a provider.
          Pick the adapter that your endpoint speaks.
          The model you get back has the same shape, so the rest of your code stays the same.
        </p>
      </header>
      <ProtocolSwitch />
    </section>

    <section class="home-section">
      <header class="home-section-head">
        <h2>Small parts.</h2>
        <p>
          Each package does one job and has no side effects, so your bundler drops what you do not import.
          Select a package to see what it brings with it.
          Sizes are minified and gzipped from source on every docs build.
        </p>
      </header>
      <SizeBar />
    </section>

    <section class="home-section">
      <header class="home-section-head">
        <h2>Runs on fetch and streams.</h2>
        <p>
          xsAI uses <code>fetch</code>, <code>ReadableStream</code>, and <code>AbortSignal</code>, and never imports a Node.js module.
          Replace <code>fetch</code> to add a proxy, a test double, or your own retries.
        </p>
      </header>
      <ul class="runtimes">
        <li v-for="runtime in runtimes" :key="runtime">
          {{ runtime }}
        </li>
      </ul>
    </section>

    <section class="home-section">
      <header class="home-section-head">
        <h2>Typed from end to end.</h2>
        <p>
          Tool inputs, results, and events are typed from your schema.
          The type below is real compiler output, rendered when these docs were built.
        </p>
      </header>
      <div class="grid grid-cols-[minmax(0,1fr)] px-5 pt-6 pb-12 md:px-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <div class="lg:col-start-2">
          <slot name="typed" />
        </div>
      </div>
    </section>

    <section class="home-section">
      <div class="grid grid-cols-[minmax(0,1fr)] gap-10 px-5 py-14 md:px-8 md:py-20 lg:grid-cols-2 lg:items-end">
        <div>
          <h2>Start with one package.</h2>
          <p class="mt-4 mb-0 max-w-[30rem]">
            Add more when you need them.
            Every package takes a model first, so they fit together without setup.
          </p>
        </div>
        <div class="flex flex-col gap-5">
          <InstallTabs />
          <div class="flex flex-wrap items-center gap-3">
            <a class="button button--primary" href="/getting-started">Get started</a>
            <a class="home-link" href="/packages">Choose packages</a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
.home .home-title {
  margin: 0;
  font-size: clamp(3rem, 1.2rem + 7.6vw, 8.5rem);
  line-height: 0.92;
  letter-spacing: -0.045em;
  color: var(--vp-c-text-1);
}

.home .home-lede {
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.25rem, 1rem + 0.9vw, 1.75rem);
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

/* The marketing layer's grey fails AA on the dark background. */
.marketing-layout .home p {
  color: var(--vp-c-text-2);
}

.home h2 {
  margin: 0;
  color: var(--vp-c-text-1);
}

.home p code,
.home .home-section-head code {
  padding: 0.05em 0.3em;
  font-size: 0.875em;
}

.home-link {
  padding: 0.625rem 0.75rem;
  border-radius: 0.625rem;
  font-weight: 500;
  color: var(--vp-c-text-1);
  text-decoration: underline;
  text-decoration-color: var(--vp-c-divider);
  text-underline-offset: 0.3em;
  transition: text-decoration-color 0.2s ease;
}

.home-link:hover {
  text-decoration-color: currentColor;
}

.home a:focus-visible {
  outline: 2px solid var(--xs-cyan-fill);
  outline-offset: 2px;
}

.home-section {
  border-top: 1px solid var(--vp-c-divider);
}

.home-section-head {
  display: grid;
  gap: 1rem 4rem;
  padding: 3.5rem 1.25rem 0;
}

@media (min-width: 768px) {
  .home-section-head {
    padding: 5rem 2rem 1rem;
  }
}

@media (min-width: 1024px) {
  .home-section-head {
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    align-items: baseline;
  }
}

.home-section-head p {
  max-width: 38rem;
  margin: 0;
}

.home-section-head + * {
  margin-top: 1rem;
}

.runtimes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--vp-c-divider);
  list-style: none;
}

.runtimes li {
  margin: 0;
  padding: 1.75rem 1.25rem;
  border-right: 1px solid var(--vp-c-divider);
  border-bottom: 1px solid var(--vp-c-divider);
  font-family: var(--font-heading);
  font-size: clamp(1.125rem, 1rem + 0.5vw, 1.5rem);
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
}

@media (min-width: 768px) {
  .runtimes li {
    padding-inline: 2rem;
  }
}

.runtimes li:last-child {
  border-right: 0;
}

/* Code blocks rendered from index.md: drop the docs chrome and the marketing inline-code outline. */
.home div[class*='language-'] {
  position: relative;
  margin: 0;
  background: transparent;
}

.home div[class*='language-'] pre {
  margin: 0;
  padding: 0;
  overflow-x: auto;
  background: transparent !important;
}

.home div[class*='language-'] code {
  display: block;
  width: fit-content;
  min-width: 100%;
  padding: 0;
  outline: none;
  border-radius: 0;
  font-size: 0.8125rem;
  line-height: 1.7;
  color: inherit;
  background: none;
}

.home div[class*='language-'] > .lang,
.home div[class*='language-'] > .copy {
  display: none;
}

/* A persisted Twoslash query floats under its line; reserve the room so it covers no code. */
.home div[class*='language-'] .line:has(.v-popper--theme-twoslash-query) {
  display: inline-block;
  padding-bottom: 3.5em;
}

</style>
