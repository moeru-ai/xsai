import type { Schema } from '@typeschema/main'

import type { ToolResult } from '.'

declare module '@xsai/generate-text' {
  export interface GenerateTextOptions {
    tools?: ToolResult<Schema>[]
  }
}
