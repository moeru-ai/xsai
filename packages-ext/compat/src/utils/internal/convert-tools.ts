import type { Tool as XSAITool, ToolOptions as XSAIToolOptions } from 'xsai'
import type { Schema } from 'xsschema'

import { tool as xsaiTool } from 'xsai'

export const convertTools = async (tools: Record<string, ((() => Promise<XSAITool> | XSAITool) | XSAITool)>): Promise<XSAITool[]> =>
  Promise.all(Object.entries(tools).map(async ([name, tool]) => {
    let result: unknown = tool

    if (typeof result === 'function')
      // eslint-disable-next-line ts/no-unsafe-call
      result = result()

    if (result instanceof Promise)
      result = await result

    // handle mastra-ai
    if (!(result as Partial<XSAITool>).function) {
      return xsaiTool({
        ...result as XSAIToolOptions<Schema>,
        name,
      })
    }
    else {
      return {
        ...result as XSAITool,
        name,
      }
    }
  }))
