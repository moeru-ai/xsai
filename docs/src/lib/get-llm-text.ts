import type { InferPageType } from 'fumadocs-core/source'

import type { source } from '@/lib/source'

export const getLLMText = async (page: InferPageType<typeof source>) => {
  const processed = await page.data.getText('processed')

  return `# ${page.data.title} (${page.url})

${processed}`
}
