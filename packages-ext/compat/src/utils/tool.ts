import type { Tool as XSAITool, ToolOptions as XSAIToolOptions } from 'xsai'

import { tool as xsaiTool } from 'xsai'

export type Tool = Omit<XSAIToolOptions, 'name'>

export const tool = (options: Tool): () => Promise<XSAITool> => async () => xsaiTool({
  ...options,
  name: '',
})
