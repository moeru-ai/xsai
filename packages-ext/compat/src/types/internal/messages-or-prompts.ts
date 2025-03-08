import type { Message as XSAIMessage } from 'xsai'

export type MessagesOrPrompts = Messages | Prompts

interface Messages extends System {
  messages: XSAIMessage[]
  prompt?: string
}

interface Prompts extends System {
  messages?: XSAIMessage[]
  prompt: string
}

interface System {
  system?: string
}
