import type { KeyedTokensInfo } from '@shikijs/magic-move/types'

import { codeToKeyedTokens, syncTokenKeys } from '@shikijs/magic-move/core'
import { createHighlighter } from 'shiki'
import { defineLoader } from 'vitepress'

export interface Protocol {
  factory: string
  id: string
  name: string
  path: string
}

export interface Protocols {
  protocols: Protocol[]
  /**
   * `transitions[from][to]` holds the two token sets with matching keys,
   * so the browser animates without diffing or loading a highlighter.
   */
  transitions: { from: KeyedTokensInfo, to: KeyedTokensInfo }[][]
}

declare const data: Protocols
export { data }

const example = (factory: string, pkg: string, env: string, baseURL: string, model: string) => `\
import { streamText } from '@xsai/text'
import { ${factory} } from '@xsai/${pkg}'

const model = ${factory}({
  apiKey: process.env.${env},
  baseURL: '${baseURL}',
  model: '${model}',
})

const { stream } = streamText(model, { input: 'Hello.' })`

const protocols = [
  {
    code: example('responses', 'text-responses', 'OPENAI_API_KEY', 'https://api.openai.com/v1/', 'gpt-6-luna'),
    factory: 'responses()',
    id: 'responses',
    name: 'OpenAI Responses',
    path: '/responses',
  },
  {
    code: example('chat', 'text-chat', 'OPENROUTER_API_KEY', 'https://openrouter.ai/api/v1/', 'moonshotai/kimi-k3'),
    factory: 'chat()',
    id: 'chat',
    name: 'Chat Completions',
    path: '/chat/completions',
  },
  {
    code: example('messages', 'text-messages', 'ANTHROPIC_API_KEY', 'https://api.anthropic.com/v1/', 'claude-haiku-5.5'),
    factory: 'messages()',
    id: 'messages',
    name: 'Anthropic Messages',
    path: '/messages',
  },
]

export default defineLoader({
  load: async (): Promise<Protocols> => {
    const highlighter = await createHighlighter({ langs: ['ts'], themes: ['github-light', 'github-dark'] })
    const steps = protocols.map(({ code }) => codeToKeyedTokens(highlighter, code, {
      lang: 'ts',
      themes: { dark: 'github-dark', light: 'github-light' },
    }))
    return {
      protocols: protocols.map(({ code: _, ...protocol }) => protocol),
      transitions: steps.map(from => steps.map(to => syncTokenKeys(from, to))),
    }
  },
})
