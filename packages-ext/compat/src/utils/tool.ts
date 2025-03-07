import type { ToolOptions as XSAIToolOptions } from 'xsai'

import { tool as xsaiTool } from 'xsai'

export type Tool = Omit<XSAIToolOptions, 'name'>

export const tool = async (options: Tool) => xsaiTool({
  ...options,
  name: '',
})
