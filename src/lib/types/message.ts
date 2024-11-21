export interface Message {
  content: string
  role: 'assistant' | 'system' | 'user' | ({} & string)
}
