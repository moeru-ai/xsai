/// <reference types="@xsai/generate-text" />

import type { Schema } from 'xsschema'

import type { ToolResult } from '.'

declare module '@xsai/generate-text' {
  export interface GenerateTextOptions {
    tools?: ToolResult<Schema>[]
  }
}
