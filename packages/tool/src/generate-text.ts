/// <reference types="@xsai/generate-text" />

import type { ToolResult } from '.'

declare module '@xsai/generate-text' {
  export interface GenerateTextOptions {
    tools?: ToolResult[]
  }
}
