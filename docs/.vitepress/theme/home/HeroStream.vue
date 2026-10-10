<script setup lang="ts">
import type { TextEvent } from '@xsai/text'
import type { Timer } from 'animejs/timer'

import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef, watch } from 'vue'

import { heroDuration, heroEvents } from './fixture'

const time = ref(0)
const playing = ref(false)
const timer = shallowRef<Timer>()

const shown = computed(() => heroEvents.filter(({ at }) => at <= time.value))
const text = computed(() => shown.value
  .map(({ event }) => event.type === 'text.delta' ? event.delta : '')
  .join(''))
const end = computed(() => shown.value.find(({ event }) => event.type === 'step.end')?.event)
const done = computed(() => end.value !== undefined)

const summarize = (event: TextEvent) => {
  switch (event.type) {
    case 'content.end': return `${event.content.type} #${event.index}`
    case 'content.start': return `${event.contentType} #${event.index}`
    case 'step.end': return `${event.status}, ${event.status === 'failed' ? event.error.message : event.reason}`
    case 'text.delta': return JSON.stringify(event.delta)
    default: return ''
  }
}

const tabs = [
  { id: 'code', label: 'app.ts' },
  { id: 'events', label: 'stream' },
  { id: 'text', label: 'text' },
] as const
type Tab = typeof tabs[number]['id']
const tab = ref<Tab>('code')

// On narrow screens the panes become tabs. Follow the stream unless the reader picked a tab.
let pinnedTab = false
watch(time, (t) => {
  if (pinnedTab)
    return
  tab.value = t < 400 ? 'code' : done.value ? 'text' : 'events'
})
const pickTab = (id: Tab) => {
  pinnedTab = true
  tab.value = id
}
const tabButtons = useTemplateRef<HTMLButtonElement[]>('tabButtons')
const onTabKey = async (event: KeyboardEvent, i: number) => {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step)
    return
  const next = tabs[(i + step + tabs.length) % tabs.length]
  pickTab(next.id)
  await nextTick()
  tabButtons.value?.[tabs.indexOf(next)]?.focus()
}

const log = useTemplateRef<HTMLOListElement>('log')
watch(() => shown.value.length, async () => {
  await nextTick()
  log.value?.scrollTo({ top: log.value.scrollHeight })
})

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const play = () => {
  if (!timer.value)
    return
  if (time.value >= heroDuration)
    timer.value.restart()
  else
    timer.value.resume()
}
const pause = () => timer.value?.pause()
const toggle = () => playing.value ? pause() : play()

const scrub = (event: Event) => {
  pause()
  pinnedTab = false
  const value = Number((event.target as HTMLInputElement).value)
  if (timer.value)
    timer.value.seek(value)
  else
    time.value = value
}

// The page starts the stream once the headline has streamed in.
let startRequested = false
const start = () => {
  startRequested = true
  if (timer.value && !reducedMotion() && time.value === 0)
    timer.value.play()
}
defineExpose({ start })

onMounted(async () => {
  if (reducedMotion()) {
    time.value = heroDuration
    tab.value = 'text'
  }
  const { createTimer } = await import('animejs/timer')
  timer.value = createTimer({
    autoplay: false,
    duration: heroDuration,
    onBegin: () => playing.value = true,
    onComplete: () => playing.value = false,
    onPause: () => playing.value = false,
    onResume: () => playing.value = true,
    onUpdate: self => time.value = Math.min(self.currentTime, heroDuration),
  })
  if (reducedMotion())
    timer.value.seek(heroDuration)
  else if (startRequested)
    timer.value.play()
})

onBeforeUnmount(() => timer.value?.revert())

const seconds = computed(() => (time.value / 1000).toFixed(2))
</script>

<template>
  <div class="hero-stream border-t border-line">
    <div class="flex border-b border-line lg:hidden" role="tablist" aria-label="Stream panes">
      <button
        v-for="(item, i) in tabs"
        :id="`hero-tab-${item.id}`"
        ref="tabButtons"
        :key="item.id"
        type="button"
        role="tab"
        :aria-selected="tab === item.id"
        :aria-controls="`hero-pane-${item.id}`"
        :tabindex="tab === item.id ? 0 : -1"
        class="relative flex-1 py-3 font-mono text-sm transition-colors"
        :class="tab === item.id ? 'text-fg' : 'text-muted'"
        @click="pickTab(item.id)"
        @keydown="onTabKey($event, i)"
      >
        {{ item.label }}
        <span
          class="absolute inset-x-0 -bottom-px h-px transition-colors"
          :class="tab === item.id ? (item.id === 'text' && done ? 'bg-lime-fill' : 'bg-cyan-fill') : 'bg-transparent'"
        />
      </button>
    </div>

    <div class="grid grid-cols-[minmax(0,1fr)] lg:grid-cols-[1.25fr_1fr_0.9fr] lg:divide-x divide-line">
      <section
        id="hero-pane-code"
        class="pane"
        :class="{ 'is-hidden': tab !== 'code' }"
        role="tabpanel"
        aria-labelledby="hero-tab-code"
      >
        <p class="pane-label">
          app.ts
        </p>
        <div>
          <slot />
        </div>
      </section>

      <section
        id="hero-pane-events"
        class="pane"
        :class="{ 'is-hidden': tab !== 'events' }"
        role="tabpanel"
        aria-labelledby="hero-tab-events"
      >
        <p class="pane-label">
          stream
          <span class="text-faint">{{ shown.length }} / {{ heroEvents.length }} events</span>
        </p>
        <ol ref="log" class="event-log" aria-label="Stream events">
          <li
            v-for="({ event, at }, i) in shown"
            :key="at"
            class="event-row"
            :class="{
              'is-latest': i === shown.length - 1 && !done,
              'is-done': event.type === 'step.end',
            }"
          >
            <span class="event-type">{{ event.type }}</span>
            <span class="event-detail">{{ summarize(event) }}</span>
          </li>
        </ol>
      </section>

      <section
        id="hero-pane-text"
        class="pane"
        :class="{ 'is-hidden': tab !== 'text' }"
        role="tabpanel"
        aria-labelledby="hero-tab-text"
      >
        <p class="pane-label">
          text
        </p>
        <p class="haiku" aria-hidden="true">
          <span>{{ text }}</span><span v-if="!done && time > 0" class="caret" />
        </p>
        <p class="done-line" :class="{ 'is-visible': done }" aria-hidden="true">
          <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 8.5 3 3 7-7" /></svg>
          <span v-if="end?.type === 'step.end'">{{ end.status }} in {{ (heroDuration / 1000).toFixed(1) }} s, {{ end.usage?.outputTokens }} tokens</span>
        </p>
        <p class="sr-only" aria-live="polite">
          {{ done ? `Stream completed. Output: ${text}` : '' }}
        </p>
      </section>
    </div>

    <div class="flex items-center gap-4 border-t border-line px-5 py-3 md:px-8">
      <button
        type="button"
        class="scrub-button"
        :aria-label="playing ? 'Pause stream' : time >= heroDuration ? 'Replay stream' : 'Play stream'"
        @click="toggle"
      >
        <svg v-if="playing" viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><rect x="3" y="2.5" width="3.5" height="11" rx="1" /><rect x="9.5" y="2.5" width="3.5" height="11" rx="1" /></svg>
        <svg v-else-if="time >= heroDuration" viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.75"><path d="M2.75 8a5.25 5.25 0 1 0 1.6-3.78" /><path d="M2.5 2.5v3h3" /></svg>
        <svg v-else viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M4 2.6v10.8a.6.6 0 0 0 .9.52l9-5.4a.6.6 0 0 0 0-1.04l-9-5.4A.6.6 0 0 0 4 2.6Z" /></svg>
      </button>
      <input
        class="scrubber"
        type="range"
        min="0"
        :max="heroDuration"
        step="10"
        :value="time"
        :style="{ '--progress': `${(time / heroDuration) * 100}%` }"
        :class="{ 'is-done': done }"
        aria-label="Stream position"
        :aria-valuetext="`${seconds} seconds, ${shown.length} events`"
        @input="scrub"
      >
      <span class="w-14 text-right font-mono text-sm text-muted tabular-nums">{{ seconds }} s</span>
    </div>
  </div>
</template>

<style scoped>
.pane {
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 21rem;
  padding: 1.25rem 1.25rem 1.5rem;
}

@media (min-width: 768px) {
  .pane {
    padding-inline: 2rem;
  }
}

@media (min-width: 1024px) {
  .pane {
    padding-inline: 1.5rem;
  }

  .pane:first-child {
    padding-left: 2rem;
  }
}

@media (max-width: 1023px) {
  .pane.is-hidden {
    display: none;
  }
}

.pane-label {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin: 0 0 1rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--vp-c-text-2);
}

@media (max-width: 1023px) {
  .pane-label {
    display: none;
  }
}

.event-log {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
  max-height: 18rem;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  list-style: none;
  scrollbar-width: none;
  mask-image: linear-gradient(to bottom, transparent, black 2.5rem);
}

.event-log::before {
  content: '';
  flex: 1 0 2.5rem;
}

.event-row {
  display: grid;
  grid-template-columns: 8.5rem 1fr;
  gap: 0.75rem;
  margin: 0;
  padding: 0.125rem 0.5rem;
  border-left: 2px solid transparent;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.5rem;
  color: var(--vp-c-text-2);
  white-space: nowrap;
}

.event-type {
  color: var(--vp-c-text-1);
}

.event-detail {
  overflow: hidden;
  text-overflow: ellipsis;
}

.event-row.is-latest {
  border-color: var(--xs-cyan-fill);
  background: color-mix(in oklab, var(--xs-cyan-fill) 8%, transparent);
}

.event-row.is-latest .event-type {
  color: var(--xs-cyan);
}

.event-row.is-done {
  border-color: var(--xs-lime-fill);
  background: color-mix(in oklab, var(--xs-lime-fill) 10%, transparent);
}

.event-row.is-done .event-type,
.event-row.is-done .event-detail {
  color: var(--xs-lime);
}

.haiku {
  flex: 1;
  margin: 0;
  font-family: var(--font-heading);
  font-size: clamp(1.375rem, 1.1rem + 0.8vw, 1.75rem);
  line-height: 1.35;
  letter-spacing: -0.01em;
  color: var(--vp-c-text-1);
  white-space: pre-line;
}

.caret {
  display: inline-block;
  width: 0.5em;
  height: 1em;
  margin-left: 0.08em;
  vertical-align: -0.12em;
  background: var(--xs-cyan-fill);
  animation: blink 1s steps(1) infinite;
}

@keyframes blink {
  50% { opacity: 0; }
}

.done-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 1.5rem 0 0;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--xs-lime);
  opacity: 0;
  transform: translateY(0.25rem);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.done-line.is-visible {
  opacity: 1;
  transform: none;
}

.scrub-button {
  display: grid;
  place-items: center;
  flex: none;
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
  color: var(--vp-c-text-1);
  transition: border-color 0.2s ease;
}

.scrub-button:hover {
  border-color: var(--vp-c-text-2);
}

.scrubber {
  flex: 1;
  height: 1.5rem;
  margin: 0;
  background: transparent;
  cursor: pointer;
  appearance: none;
  --track: linear-gradient(to right, var(--xs-cyan-fill) var(--progress), var(--vp-c-divider) var(--progress));
}

.scrubber.is-done {
  --track: linear-gradient(to right, var(--xs-lime-fill) var(--progress), var(--vp-c-divider) var(--progress));
}

.scrubber::-webkit-slider-runnable-track {
  height: 2px;
  background: var(--track);
}

.scrubber::-moz-range-track {
  height: 2px;
  background: var(--track);
}

.scrubber::-webkit-slider-thumb {
  width: 0.75rem;
  height: 0.75rem;
  margin-top: calc(-0.375rem + 1px);
  border: 2px solid var(--vp-c-bg);
  border-radius: 999px;
  background: var(--vp-c-text-1);
  appearance: none;
}

.scrubber::-moz-range-thumb {
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid var(--vp-c-bg);
  border-radius: 999px;
  background: var(--vp-c-text-1);
}

.scrub-button:focus-visible,
.scrubber:focus-visible,
[role='tab']:focus-visible {
  outline: 2px solid var(--xs-cyan-fill);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .caret {
    animation: none;
  }

  .done-line {
    transition: none;
  }
}
</style>
