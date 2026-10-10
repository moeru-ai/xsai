<script setup lang="ts">
import { nextTick, ref, useTemplateRef } from 'vue'

const managers = [
  { command: 'pnpm add xsai', name: 'pnpm' },
  { command: 'npm install xsai', name: 'npm' },
  { command: 'bun add xsai', name: 'bun' },
  { command: 'deno add npm:xsai', name: 'deno' },
]

const active = ref(0)
const copied = ref(false)
const tabs = useTemplateRef<HTMLButtonElement[]>('tabs')
let reset: ReturnType<typeof setTimeout> | undefined

const select = (i: number) => {
  active.value = i
  copied.value = false
}

const onKey = async (event: KeyboardEvent) => {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step)
    return
  select((active.value + step + managers.length) % managers.length)
  await nextTick()
  tabs.value?.[active.value]?.focus()
}

const copy = async () => {
  await navigator.clipboard.writeText(managers[active.value].command)
  copied.value = true
  clearTimeout(reset)
  reset = setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <div class="install">
    <div class="flex border-b border-line" role="tablist" aria-label="Package manager" @keydown="onKey">
      <button
        v-for="(manager, i) in managers"
        :id="`install-tab-${manager.name}`"
        ref="tabs"
        :key="manager.name"
        type="button"
        role="tab"
        :aria-selected="active === i"
        aria-controls="install-panel"
        :tabindex="active === i ? 0 : -1"
        class="install-tab"
        :class="{ 'is-active': active === i }"
        @click="select(i)"
      >
        {{ manager.name }}
      </button>
    </div>
    <div id="install-panel" class="flex items-center gap-4 py-4 pl-4 pr-2" role="tabpanel" :aria-labelledby="`install-tab-${managers[active].name}`">
      <span class="font-mono text-[0.9375rem] text-fg"><span class="select-none text-faint">$ </span>{{ managers[active].command }}</span>
      <button type="button" class="copy" :class="{ 'is-copied': copied }" @click="copy">
        <svg v-if="copied" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 8.5 3 3 7-7" /></svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5.5" y="5.5" width="8" height="8" rx="1.5" /><path d="M10.5 5.5v-2a1 1 0 0 0-1-1h-6a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" /></svg>
        <span aria-live="polite">{{ copied ? 'Copied' : 'Copy' }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.install {
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  background: var(--vp-c-bg);
}

.install-tab {
  position: relative;
  padding: 0.625rem 1rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

.install-tab.is-active {
  color: var(--vp-c-text-1);
}

.install-tab.is-active::after {
  content: '';
  position: absolute;
  inset: auto 0 -1px;
  height: 1px;
  background: var(--vp-c-text-1);
}

.copy {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  margin-left: auto;
  padding: 0.375rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
  transition: color 0.2s ease, background-color 0.2s ease;
}

.copy:hover {
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-alt);
}

.copy.is-copied {
  color: var(--xs-lime);
  background: color-mix(in oklab, var(--xs-lime-fill) 12%, transparent);
}

.install-tab:focus-visible,
.copy:focus-visible {
  outline: 2px solid var(--xs-cyan-fill);
  outline-offset: 2px;
}
</style>
