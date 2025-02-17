import { createDeepSeek } from './deepseek'
import { createGoogleGenerativeAI } from './google-generative-ai'
import { createNovita } from './novita'
import { createOllama } from './ollama'
import { createOpenAI } from './openai'
import { createOpenRouter } from './openrouter'
import { createSiliconFlow } from './silicon-flow'
import { createWorkersAI } from './workers-ai'

export const llmProviders = {
  deepseek: {
    create: createDeepSeek,
  },
  googleGenerativeAI: {
    create: createGoogleGenerativeAI,
  },
  novita: {
    create: createNovita,
  },
  ollama: {
    create: createOllama,
  },
  openai: {
    create: createOpenAI,
  },
  openrouter: {
    create: createOpenRouter,
  },
  siliconFlow: {
    create: createSiliconFlow,
  },
  workersAI: {
    create: createWorkersAI,
  },
}
