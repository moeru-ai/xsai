export interface ExtractReasoningOptions {
  /** @default `false` */
  startWithReasoning?: boolean
  /** @default `think` */
  tagName: string
}

export interface ExtractReasoningResult {
  reasoning?: string
  text: string
}

export const extractReasoning = (text: string, options: ExtractReasoningOptions = {
  tagName: 'think',
}) => {
  const startTag = `<${options.tagName}>`
  const endTag = `<\/${options.tagName}>`
  const rawText = options.startWithReasoning ? startTag + text : text

  const regex = new RegExp(`${startTag}(.*?)${endTag}(.*)`, 'gs')
  const match = regex.exec(rawText)

  if (match) {
    return {
      reasoning: match[1],
      text: match[2],
    }
  }
  else {
    return {
      reasoning: undefined,
      text,
    }
  }
}
