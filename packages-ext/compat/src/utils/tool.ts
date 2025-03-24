import type { Tool as XSAITool, ToolOptions as XSAIToolOptions } from 'xsai'
import type { Schema } from 'xsschema'

import { tool as xsaiTool } from 'xsai'

export type Tool<T extends Schema> = Omit<XSAIToolOptions<T>, 'name'>

export const tool = <T extends Schema>(options: Tool<T>): () => Promise<XSAITool> => async () => xsaiTool<T>({
  ...options,
  name: '',
})
