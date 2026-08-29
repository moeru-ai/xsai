import type { AssistantMessageItemParam, DeveloperMessageItemParam, ItemField, ItemParam, ReasoningItemParam, SystemMessageItemParam, UserMessageItemParam } from '../generated'

export const normalizeOutput = (item: ItemField): ItemParam => {
  switch (item.type) {
    case 'compaction':
    case 'function_call':
    case 'function_call_output':
      return item
    case 'message':
      return item as AssistantMessageItemParam | DeveloperMessageItemParam | SystemMessageItemParam | UserMessageItemParam
    case 'reasoning':
      return item as ReasoningItemParam
  }
}
