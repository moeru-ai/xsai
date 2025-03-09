import { Mastra } from '@mastra/core'

import { weatherAgent } from './agents/weather'

const mastra = new Mastra({ agents: { weatherAgent } })

const agent = mastra.getAgent('weatherAgent')

// eslint-disable-next-line antfu/no-top-level-await
const result = await agent.generate('What is the weather in London?')

// eslint-disable-next-line @masknet/no-top-level, no-console
console.log('Agent response:', result.text)
