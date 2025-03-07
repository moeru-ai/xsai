import type { Tool as XSAITool } from 'xsai'

export const convertTools = async (tools: Record<string, () => Promise<XSAITool>>): Promise<XSAITool[]> =>
  Promise.all(Object.entries(tools).map(async ([name, toolFn]) => ({
    ...await toolFn(),
    name,
  })))
