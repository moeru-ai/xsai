import type { AnthropicToolResultBlockParam, AnthropicToolUseBlock } from '../types/anthropic-message'
import type { ExecutableTool } from '../types/anthropic-tool'

import { wrapToolResult } from './wrap-tool-result'

export interface ExecuteToolOptions {
  tools?: ExecutableTool[]
  toolUse: AnthropicToolUseBlock
}

export interface ExecuteToolResult {
  toolResult: AnthropicToolResultBlockParam
}

export const executeTool = async ({ tools, toolUse }: ExecuteToolOptions): Promise<ExecuteToolResult> => {
  const tool = tools?.find(tool => tool.name === toolUse.name)

  if (!tool) {
    const availableTools = tools?.map(tool => tool.name)
    const availableToolsErrorMsg = (availableTools == null || availableTools.length === 0)
      ? 'No tools are available'
      : `Available tools: ${availableTools.join(', ')}`
    throw new Error(`Model tried to call unavailable tool "${toolUse.name}", ${availableToolsErrorMsg}.`)
  }

  const toolResult = wrapToolResult(await tool.execute(toolUse.input))

  return {
    toolResult: {
      content: toolResult,
      tool_use_id: toolUse.id,
      type: 'tool_result',
    },
  }
}
