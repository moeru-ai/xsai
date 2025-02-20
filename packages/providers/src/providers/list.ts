import { createDeepSeek } from './deepseek'
import { createFireworksAI } from './fireworks-ai'
import { createGoogleGenerativeAI } from './google-generative-ai'
import { createGroq } from './groq'
import { createMinimax } from './minimax'
import { createMistralAI } from './mistral-ai'
import { createMoonshot } from './moonshot'
import { createNovita } from './novita'
import { createOllama } from './ollama'
import { createOpenAI } from './openai'
import { createOpenRouter } from './openrouter'
import { createPerplexity } from './perplexity'
import { createQwen } from './qwen'
import { createSiliconFlow } from './silicon-flow'
import { createStepfun } from './stepfun'
import { createTencentHunyuan } from './tencent-hunyuan'
import { createTogetherAI } from './together-ai'
import { createWorkersAI } from './workers-ai'
import { createXAI } from './xai'
import { createZhipu } from './zhipu'

export const llmProviders = {
  deepseek: {
    create: createDeepSeek,
  },
  fireworksAI: {
    create: createFireworksAI,
  },
  googleGenerativeAI: {
    create: createGoogleGenerativeAI,
  },
  groq: {
    create: createGroq,
  },
  minimax: {
    create: createMinimax,
  },
  mistralAI: {
    create: createMistralAI,
  },
  moonshot: {
    create: createMoonshot,
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
  perplexity: {
    create: createPerplexity,
  },
  qwen: {
    create: createQwen,
  },
  siliconFlow: {
    create: createSiliconFlow,
  },
  stepfun: {
    create: createStepfun,
  },
  tencentHunyuan: {
    create: createTencentHunyuan,
  },
  togetherAI: {
    create: createTogetherAI,
  },
  workersAI: {
    create: createWorkersAI,
  },
  xai: {
    create: createXAI,
  },
  zhipu: {
    create: createZhipu,
  },
}
