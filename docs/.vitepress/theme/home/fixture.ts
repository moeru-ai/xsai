import type { TextEvent } from '@xsai/text'

export interface TimedEvent {
  /** Milliseconds after the request starts. */
  at: number
  event: TextEvent
}

const deltas = [
  'small',
  ' seed',
  ' in',
  ' the',
  ' dark\n',
  'holds',
  ' the',
  ' whole',
  ' forest',
  ' folded',
  '\n',
  'fetch,',
  ' and',
  ' it',
  ' opens',
]

const text = deltas.join('')
const firstDelta = 520
const deltaGap = 110
const lastDelta = firstDelta + (deltas.length - 1) * deltaGap

/**
 * A recorded-shaped `streamText` run for the homepage hero.
 * Typed against `@xsai/text`, so a change to the event vocabulary fails typecheck.
 */
export const heroEvents: TimedEvent[] = [
  { at: 0, event: { type: 'step.start' } },
  { at: 420, event: { contentType: 'text', index: 0, type: 'content.start' } },
  ...deltas.map((delta, i): TimedEvent => ({
    at: firstDelta + i * deltaGap,
    event: { delta, index: 0, type: 'text.delta' },
  })),
  { at: lastDelta + 160, event: { content: { text, type: 'text' }, index: 0, type: 'content.end' } },
  {
    at: lastDelta + 300,
    event: {
      message: { content: [{ text, type: 'text' }], role: 'assistant' },
      reason: 'stop',
      status: 'completed',
      type: 'step.end',
      usage: { inputTokens: 14, outputTokens: deltas.length, totalTokens: 14 + deltas.length },
    },
  },
]

export const heroDuration = heroEvents.at(-1)!.at
