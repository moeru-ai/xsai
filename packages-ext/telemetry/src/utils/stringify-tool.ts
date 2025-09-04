import type { Tool } from 'xsai'

export const stringifyTool = ({ function: func, type }: Tool) =>
  JSON.stringify({ description: func.description, inputSchema: func.parameters, name: func.name, type })
