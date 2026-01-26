import type { AssistantMessageItemParam, DeveloperMessageItemParam, FunctionCallItemParam, FunctionCallOutputItemParam, ItemField, ItemParam, ReasoningItemParam, SystemMessageItemParam, UserMessageItemParam } from '../generated'

export const normalizeOutput = (output: ItemField[]): ItemParam[] =>
  // eslint-disable-next-line array-callback-return
  output.map((item) => {
    switch (item.type) {
      case 'function_call':
        return item as FunctionCallItemParam
      case 'function_call_output':
        return item as FunctionCallOutputItemParam
      case 'message':
        return item as AssistantMessageItemParam | DeveloperMessageItemParam | SystemMessageItemParam | UserMessageItemParam
      case 'reasoning':
        return item as ReasoningItemParam
    }
  })
