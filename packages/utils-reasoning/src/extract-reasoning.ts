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
  // eslint-disable-next-line sonarjs/no-nested-template-literals
  const regex = new RegExp(`${options.startWithReasoning ? '' : `<${options.tagName}>`}(.*?)<\/${options.tagName}>(.*)`, 'gs')
  const match = regex.exec(text)

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
