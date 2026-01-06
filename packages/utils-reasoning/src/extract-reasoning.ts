export interface ExtractReasoningOptions {
  /** @default `\n` */
  separator?: string
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
  const endTag = `</${options.tagName}>`
  const separator = options.separator ?? '\n'
  const fullText = options.startWithReasoning ? startTag + text : text

  const regex = new RegExp(`${startTag}(.*?)${endTag}`, 'gs')
  const reasonMatches = [...fullText.matchAll(regex)]

  if (reasonMatches.length === 0) {
    return {
      reasoning: undefined,
      text,
    }
  }

  const reasoning = reasonMatches.map(match => match[1]).join(separator)

  let startIndex = 0
  const texts = reasonMatches.reduce((acc, match, idx) => {
    if (startIndex < match.index) {
      acc.push(fullText.slice(startIndex, match.index))
    }
    startIndex = match.index + match[0].length

    // last match
    if (idx === reasonMatches.length - 1) {
      acc.push(fullText.slice(startIndex))
    }

    return acc
  }, [] as string[]).join(separator)

  return {
    reasoning,
    text: texts,
  }
}
