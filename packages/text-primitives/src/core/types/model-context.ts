import type { Tool } from '../tool'
import type { Message } from './message'

export interface ModelContext {
  input: Message[] | string
  instructions?: string
  tools?: Tool[]
}
