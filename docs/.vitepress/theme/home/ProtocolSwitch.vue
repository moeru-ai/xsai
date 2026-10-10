<script setup lang="ts">
import { ShikiMagicMoveRenderer } from '@shikijs/magic-move/vue'
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from 'vue'

import { data } from './protocols.data'

import '@shikijs/magic-move/style.css'

/** 1-based lines that differ between the examples. */
const changedLines = [2, 4, 5, 6, 7, 8]

const { protocols, transitions } = data
const active = ref(0)
const previous = ref(0)
watch(active, (_, from) => previous.value = from)
const transition = computed(() => transitions[previous.value][active.value])
const animate = ref(true)
onMounted(() => animate.value = !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
const buttons = useTemplateRef<HTMLButtonElement[]>('buttons')

const onKey = async (event: KeyboardEvent) => {
  const step = ['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : ['ArrowUp', 'ArrowLeft'].includes(event.key) ? -1 : 0
  if (!step)
    return
  event.preventDefault()
  active.value = (active.value + step + protocols.length) % protocols.length
  await nextTick()
  buttons.value?.[active.value]?.focus()
}

// Wires run from each protocol row (y = 20, 60, 100) to the model node (y = 60).
const wire = (i: number) => `M0 ${20 + i * 40} C 55 ${20 + i * 40}, 45 60, 100 60`
</script>

<template>
  <div class="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:divide-x divide-line">
    <div class="flex items-stretch gap-0 px-5 py-8 md:px-8">
      <div class="flex flex-1 flex-col justify-between gap-2" role="radiogroup" aria-label="Wire protocol" @keydown="onKey">
        <button
          v-for="(protocol, i) in protocols"
          :key="protocol.id"
          ref="buttons"
          type="button"
          role="radio"
          :aria-checked="active === i"
          :tabindex="active === i ? 0 : -1"
          class="protocol"
          :class="{ 'is-active': active === i }"
          @click="active = i"
        >
          <span class="block font-medium">{{ protocol.name }}</span>
          <span class="block font-mono text-[0.8125rem] text-muted">{{ protocol.factory }} to {{ protocol.path }}</span>
        </button>
      </div>
      <svg class="wires hidden w-[22%] shrink-0 sm:block" viewBox="0 0 100 120" preserveAspectRatio="none" aria-hidden="true">
        <path v-for="(_, i) in protocols" :key="i" :d="wire(i)" class="wire" />
        <path :d="wire(active)" class="wire is-active" />
      </svg>
      <div class="hidden shrink-0 flex-col justify-center sm:flex">
        <span class="model-node">LanguageModel</span>
      </div>
    </div>

    <div class="protocol-code border-t border-line px-5 py-8 md:px-8 lg:border-t-0">
      <div class="relative overflow-x-auto">
        <span
          v-for="line in changedLines"
          :key="line"
          class="changed-line"
          :style="{ top: `${(line - 1) * 1.7}em` }"
          aria-hidden="true"
        />
        <ShikiMagicMoveRenderer
          class="protocol-code-block"
          :tokens="transition.to"
          :previous="transition.from"
          :animate="animate"
          :options="{ containerStyle: false, duration: 600, stagger: 2 }"
        />
      </div>
      <p class="mt-6 mb-0 text-sm text-muted md:text-base">
        Only the marked lines change. <code>streamText</code> and every event after it stay the same.
      </p>
    </div>
  </div>
</template>

<style scoped>
.protocol {
  padding: 0.875rem 1rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 0.5rem;
  text-align: left;
  color: var(--vp-c-text-1);
  transition: border-color 0.2s ease, background-color 0.2s ease;
}

.protocol:hover {
  border-color: var(--vp-c-text-3);
}

.protocol.is-active {
  border-color: var(--xs-cyan-fill);
  background: color-mix(in oklab, var(--xs-cyan-fill) 7%, transparent);
}

.protocol:focus-visible {
  outline: 2px solid var(--xs-cyan-fill);
  outline-offset: 2px;
}

.wire {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
}

.wire.is-active {
  stroke: var(--xs-cyan-fill);
  stroke-dasharray: 6 6;
  animation: flow 0.8s linear infinite;
}

@keyframes flow {
  to { stroke-dashoffset: -12; }
}

.changed-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1.7em;
  border-left: 2px solid var(--xs-cyan-fill);
  background: color-mix(in oklab, var(--xs-cyan-fill) 8%, transparent);
  font-size: 0.8125rem;
}

.protocol-code-block {
  position: relative;
  margin: 0;
  padding: 0 0 0 0.75rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.7;
  background: transparent;
}

.dark .protocol-code-block :deep(.shiki-magic-move-item) {
  color: var(--shiki-dark) !important;
}

.model-node {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--vp-c-text-1);
  border-radius: 0.375rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg);
}

@media (prefers-reduced-motion: reduce) {
  .wire.is-active {
    animation: none;
    stroke-dasharray: none;
  }
}
</style>
