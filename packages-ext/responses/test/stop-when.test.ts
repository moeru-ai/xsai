import type { Step, StopContext } from '../src'
import type { ResponseResource } from '../src/generated'

import { describe, expect, it } from 'vitest'

import { and, hasFunctionCall, not, or, stepCountAtLeast } from '../src'

const createContext = (overrides: Partial<StopContext> = {}): StopContext => {
  // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
  const step = overrides.step ?? {
    functionCallOutputs: [],
    functionCalls: [],
    response: {
      id: 'resp_1',
      object: 'response',
      output: [],
      status: 'completed',
    },
    text: undefined,
    usage: undefined,
  } as unknown as Step

  return {
    input: [],
    step,
    steps: overrides.steps ?? [step],
  }
}

describe('@xsai-ext/responses stopWhen helpers', () => {
  it('counts steps', () => {
    expect(stepCountAtLeast(2)(createContext({
      steps: [
        createContext().step,
        createContext().step,
      ],
    }))).toBe(true)
  })

  it('matches function calls by name', () => {
    const context = createContext({
      step: {
        functionCallOutputs: [],
        functionCalls: [{
          arguments: '{}',
          call_id: 'call_1',
          id: 'fc_1',
          name: 'weather',
          status: 'completed',
          type: 'function_call',
        }],
        // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
        response: {
          id: 'resp_1',
          object: 'response',
          output: [],
          status: 'completed',
        } as unknown as ResponseResource,
      },
    })

    expect(hasFunctionCall()(context)).toBe(true)
    expect(hasFunctionCall('weather')(context)).toBe(true)
    expect(hasFunctionCall('search')(context)).toBe(false)
  })

  it('supports composition', () => {
    const context = createContext({
      step: {
        functionCallOutputs: [],
        functionCalls: [{
          arguments: '{}',
          call_id: 'call_1',
          id: 'fc_1',
          name: 'finalAnswer',
          status: 'completed',
          type: 'function_call',
        }],
        // eslint-disable-next-line @masknet/type-no-force-cast-via-top-type
        response: {
          id: 'resp_1',
          object: 'response',
          output: [],
          status: 'completed',
        } as unknown as ResponseResource,
      },
      steps: [
        createContext().step,
        createContext().step,
      ],
    })

    expect(or(stepCountAtLeast(5), hasFunctionCall('finalAnswer'))(context)).toBe(true)
    expect(and(stepCountAtLeast(2), hasFunctionCall('finalAnswer'))(context)).toBe(true)
    expect(not(hasFunctionCall('search'))(context)).toBe(true)
  })
})
