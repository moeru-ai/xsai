import type * as Responses from '../../generated'

export type ResponsesOutputItem = Responses.ItemField | ResponsesUnknownOutputItem

/** Responses output retained on an assistant message for the next input. */
export interface ResponsesProviderMessageMetadata {
  output: readonly ResponsesOutputItem[]
  responseId?: string
}

/** Fallback for Responses output items not present in the generated schema. */
export interface ResponsesUnknownOutputItem {
  readonly [key: string]: unknown
  readonly type: string
}
