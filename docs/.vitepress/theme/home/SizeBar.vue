<script setup lang="ts">
import { computed, ref } from 'vue'

import { data } from './sizes.data'

const order = [
  '@xsai/shared',
  '@xsai/text',
  '@xsai/text-responses',
  '@xsai/text-chat',
  '@xsai/text-messages',
  '@xsai/audio',
  '@xsai/decide',
  '@xsai/image',
  '@xsai/embed',
  '@xsai/model',
]

const packages = order
  .map(name => data.packages.find(pkg => pkg.name === name))
  .filter(pkg => pkg !== undefined)
const byName = new Map(data.packages.map(pkg => [pkg.name, pkg]))

const kb = (bytes: number) => `${(bytes / 1000).toFixed(1)} KB`

const selected = ref('@xsai/text-responses')

const closure = (name: string, seen = new Set<string>()): Set<string> => {
  for (const dep of byName.get(name)?.dependencies ?? []) {
    if (!seen.has(dep)) {
      seen.add(dep)
      closure(dep, seen)
    }
  }
  return seen
}

const deps = computed(() => closure(selected.value))
const shipped = computed(() => [selected.value, ...deps.value]
  .reduce((sum, name) => sum + (byName.get(name)?.bytes ?? 0), 0))

const state = (name: string) =>
  name === selected.value ? 'is-selected' : deps.value.has(name) ? 'is-dep' : ''
</script>

<template>
  <div class="px-5 py-8 md:px-8">
    <div class="size-bar" role="presentation">
      <span
        v-for="pkg in packages"
        :key="pkg.name"
        class="segment"
        :class="state(pkg.name)"
        :style="{ flexGrow: pkg.bytes }"
        @pointerenter="selected = pkg.name"
      />
    </div>

    <p class="readout" aria-live="polite">
      <span class="font-mono text-fg">{{ selected }}</span>
      <span>{{ kb(byName.get(selected)?.bytes ?? 0) }}</span>
      <template v-if="deps.size">
        <span>with {{ [...deps].join(' and ') }}:</span>
        <span class="text-fg">{{ kb(shipped) }}</span>
      </template>
      <span v-else>with no dependencies</span>
    </p>

    <ul class="size-list">
      <li v-for="pkg in packages" :key="pkg.name">
        <button
          type="button"
          class="size-item"
          :class="state(pkg.name)"
          :aria-pressed="pkg.name === selected"
          @click="selected = pkg.name"
          @focus="selected = pkg.name"
          @pointerenter="selected = pkg.name"
        >
          <span class="swatch" />
          <span class="font-mono">{{ pkg.name }}</span>
          <span class="ml-auto tabular-nums text-muted">{{ kb(pkg.bytes) }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.size-bar {
  display: flex;
  height: 3.5rem;
  gap: 2px;
}

.segment {
  flex-basis: 0;
  min-width: 3px;
  border-radius: 2px;
  background: var(--vp-c-bg-alt);
  transition: background-color 0.2s ease;
}

.segment.is-dep,
.size-item.is-dep .swatch {
  background: color-mix(in oklab, var(--vp-c-text-1) 35%, transparent);
}

.segment.is-selected,
.size-item.is-selected .swatch {
  background: var(--vp-c-text-1);
}

.readout {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  min-height: 3.5rem;
  margin: 1.25rem 0 1.5rem;
  font-size: 1rem;
  color: var(--vp-c-text-2);
}

.size-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(17.5rem, 1fr));
  gap: 0 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.size-list li {
  margin: 0;
}

.size-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.875rem;
  color: var(--vp-c-text-1);
  text-align: left;
}

.size-item:focus-visible {
  outline: 2px solid var(--xs-cyan-fill);
  outline-offset: 2px;
}

.swatch {
  width: 0.625rem;
  height: 0.625rem;
  border-radius: 2px;
  background: var(--vp-c-bg-alt);
  box-shadow: inset 0 0 0 1px var(--vp-c-divider);
}
</style>
