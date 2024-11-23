import type { Schema } from '@typeschema/main'
import type { GenerateTextOptions as _GTO } from '@xsai/generate-text'

import type { ToolResult } from '.'

declare module '@xsai/generate-text' {
  export interface GenerateTextOptions {
    tools?: ToolResult<Schema>[]
  }
}
