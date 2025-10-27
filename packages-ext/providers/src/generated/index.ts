/* eslint-disable perfectionist/sort-named-imports */

import process from 'node:process'

import {
  createMoonshotaiCn,
  createLucidquery,
  createMoonshotai,
  createZaiCodingPlan,
  createAlibaba,
  createVultr,
  createNvidia,
  createUpstage,
  createNebius,
  createDeepseek,
  createAlibabaCn,
  createVenice,
  createChutes,
  createCortecs,
  createBaseten,
  createOpencode,
  createFastrouter,
  createInception,
  createWandb,
  createZhipuaiCodingPlan,
  createSynthetic,
  createZhipuai,
  createZai,
  createInference,
  createRequesty,
  createMorph,
  createLmstudio,
  createFireworksAi,
  createModelscope,
  createLlama,
  createScaleway,
  createCerebras,
  createDeepinfra,
  createGroq,
  createMistral,
} from './create'

/**
 * Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 * @remarks
 * - baseURL - `https://api.moonshot.cn/v1`
 * - apiKey - `MOONSHOT_API_KEY`
 */
export const moonshotaiCn = createMoonshotaiCn(process.env.MOONSHOT_API_KEY!)

/**
 * LucidQuery AI Provider
 * @see {@link https://lucidquery.com/api/docs}
 * @remarks
 * - baseURL - `https://lucidquery.com/api/v1`
 * - apiKey - `LUCIDQUERY_API_KEY`
 */
export const lucidquery = createLucidquery(process.env.LUCIDQUERY_API_KEY!)

/**
 * Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 * @remarks
 * - baseURL - `https://api.moonshot.ai/v1`
 * - apiKey - `MOONSHOT_API_KEY`
 */
export const moonshotai = createMoonshotai(process.env.MOONSHOT_API_KEY!)

/**
 * Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 * @remarks
 * - baseURL - `https://api.z.ai/api/coding/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zaiCodingPlan = createZaiCodingPlan(process.env.ZHIPU_API_KEY!)

/**
 * Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 * @remarks
 * - baseURL - `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
 * - apiKey - `DASHSCOPE_API_KEY`
 */
export const alibaba = createAlibaba(process.env.DASHSCOPE_API_KEY!)

/**
 * Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 * @remarks
 * - baseURL - `https://api.vultrinference.com/v1`
 * - apiKey - `VULTR_API_KEY`
 */
export const vultr = createVultr(process.env.VULTR_API_KEY!)

/**
 * Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 * @remarks
 * - baseURL - `https://integrate.api.nvidia.com/v1`
 * - apiKey - `NVIDIA_API_KEY`
 */
export const nvidia = createNvidia(process.env.NVIDIA_API_KEY!)

/**
 * Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 * @remarks
 * - baseURL - `https://api.upstage.ai`
 * - apiKey - `UPSTAGE_API_KEY`
 */
export const upstage = createUpstage(process.env.UPSTAGE_API_KEY!)

/**
 * Nebius AI Studio Provider
 * @see {@link https://docs.studio.nebius.com/quickstart}
 * @remarks
 * - baseURL - `https://api.studio.nebius.com/v1/`
 * - apiKey - `NEBIUS_API_KEY`
 */
export const nebius = createNebius(process.env.NEBIUS_API_KEY!)

/**
 * DeepSeek Provider
 * @see {@link https://platform.deepseek.com/api-docs/pricing}
 * @remarks
 * - baseURL - `https://api.deepseek.com`
 * - apiKey - `DEEPSEEK_API_KEY`
 */
export const deepseek = createDeepseek(process.env.DEEPSEEK_API_KEY!)

/**
 * Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 * @remarks
 * - baseURL - `https://dashscope.aliyuncs.com/compatible-mode/v1`
 * - apiKey - `DASHSCOPE_API_KEY`
 */
export const alibabaCn = createAlibabaCn(process.env.DASHSCOPE_API_KEY!)

/**
 * Venice AI Provider
 * @see {@link https://docs.venice.ai}
 * @remarks
 * - baseURL - `https://api.venice.ai/api/v1`
 * - apiKey - `VENICE_API_KEY`
 */
export const venice = createVenice(process.env.VENICE_API_KEY!)

/**
 * Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 * @remarks
 * - baseURL - `https://llm.chutes.ai/v1`
 * - apiKey - `CHUTES_API_KEY`
 */
export const chutes = createChutes(process.env.CHUTES_API_KEY!)

/**
 * Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 * @remarks
 * - baseURL - `https://api.cortecs.ai/v1`
 * - apiKey - `CORTECS_API_KEY`
 */
export const cortecs = createCortecs(process.env.CORTECS_API_KEY!)

/**
 * Baseten Provider
 * @see {@link https://docs.baseten.co/development/model-apis/overview}
 * @remarks
 * - baseURL - `https://inference.baseten.co/v1`
 * - apiKey - `BASETEN_API_KEY`
 */
export const baseten = createBaseten(process.env.BASETEN_API_KEY!)

/**
 * OpenCode Zen Provider
 * @see {@link https://opencode.ai/docs/zen}
 * @remarks
 * - baseURL - `https://opencode.ai/zen/v1`
 * - apiKey - `OPENCODE_API_KEY`
 */
export const opencode = createOpencode(process.env.OPENCODE_API_KEY!)

/**
 * FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 * @remarks
 * - baseURL - `https://go.fastrouter.ai/api/v1`
 * - apiKey - `FASTROUTER_API_KEY`
 */
export const fastrouter = createFastrouter(process.env.FASTROUTER_API_KEY!)

/**
 * Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 * @remarks
 * - baseURL - `https://api.inceptionlabs.ai/v1/`
 * - apiKey - `INCEPTION_API_KEY`
 */
export const inception = createInception(process.env.INCEPTION_API_KEY!)

/**
 * Weights & Biases Provider
 * @see {@link https://weave-docs.wandb.ai/guides/integrations/inference/}
 * @remarks
 * - baseURL - `https://api.inference.wandb.ai/v1`
 * - apiKey - `WANDB_API_KEY`
 */
export const wandb = createWandb(process.env.WANDB_API_KEY!)

/**
 * Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 * @remarks
 * - baseURL - `https://open.bigmodel.cn/api/coding/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zhipuaiCodingPlan = createZhipuaiCodingPlan(process.env.ZHIPU_API_KEY!)

/**
 * Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 * @remarks
 * - baseURL - `https://api.synthetic.new/v1`
 * - apiKey - `SYNTHETIC_API_KEY`
 */
export const synthetic = createSynthetic(process.env.SYNTHETIC_API_KEY!)

/**
 * Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 * @remarks
 * - baseURL - `https://open.bigmodel.cn/api/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zhipuai = createZhipuai(process.env.ZHIPU_API_KEY!)

/**
 * Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 * @remarks
 * - baseURL - `https://api.z.ai/api/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zai = createZai(process.env.ZHIPU_API_KEY!)

/**
 * Inference Provider
 * @see {@link https://inference.net/models}
 * @remarks
 * - baseURL - `https://inference.net/v1`
 * - apiKey - `INFERENCE_API_KEY`
 */
export const inference = createInference(process.env.INFERENCE_API_KEY!)

/**
 * Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 * @remarks
 * - baseURL - `https://router.requesty.ai/v1`
 * - apiKey - `REQUESTY_API_KEY`
 */
export const requesty = createRequesty(process.env.REQUESTY_API_KEY!)

/**
 * Morph Provider
 * @see {@link https://docs.morphllm.com/api-reference/introduction}
 * @remarks
 * - baseURL - `https://api.morphllm.com/v1`
 * - apiKey - `MORPH_API_KEY`
 */
export const morph = createMorph(process.env.MORPH_API_KEY!)

/**
 * LMStudio Provider
 * @see {@link https://lmstudio.ai/models}
 * @remarks
 * - baseURL - `http://127.0.0.1:1234/v1`
 * - apiKey - `LMSTUDIO_API_KEY`
 */
export const lmstudio = createLmstudio(process.env.LMSTUDIO_API_KEY!)

/**
 * Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 * @remarks
 * - baseURL - `https://api.fireworks.ai/inference/v1/`
 * - apiKey - `FIREWORKS_API_KEY`
 */
export const fireworksAi = createFireworksAi(process.env.FIREWORKS_API_KEY!)

/**
 * ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 * @remarks
 * - baseURL - `https://api-inference.modelscope.cn/v1`
 * - apiKey - `MODELSCOPE_API_KEY`
 */
export const modelscope = createModelscope(process.env.MODELSCOPE_API_KEY!)

/**
 * Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 * @remarks
 * - baseURL - `https://api.llama.com/compat/v1/`
 * - apiKey - `LLAMA_API_KEY`
 */
export const llama = createLlama(process.env.LLAMA_API_KEY!)

/**
 * Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 * @remarks
 * - baseURL - `https://api.scaleway.ai/v1`
 * - apiKey - `SCALEWAY_API_KEY`
 */
export const scaleway = createScaleway(process.env.SCALEWAY_API_KEY!)

/**
 * Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/resources/openai}
 * @remarks
 * - baseURL - `https://api.cerebras.ai/v1/`
 * - apiKey - `CEREBRAS_API_KEY`
 */
export const cerebras = createCerebras(process.env.CEREBRAS_API_KEY!)

/**
 * Deep Infra Provider
 * @see {@link https://deepinfra.com/docs/openai_api}
 * @remarks
 * - baseURL - `https://api.deepinfra.com/v1/openai/`
 * - apiKey - `DEEPINFRA_API_KEY`
 */
export const deepinfra = createDeepinfra(process.env.DEEPINFRA_API_KEY!)

/**
 * Groq Provider
 * @see {@link https://console.groq.com/docs/openai}
 * @remarks
 * - baseURL - `https://api.groq.com/openai/v1/`
 * - apiKey - `GROQ_API_KEY`
 */
export const groq = createGroq(process.env.GROQ_API_KEY!)

/**
 * Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 * @remarks
 * - baseURL - `https://api.mistral.ai/v1/`
 * - apiKey - `MISTRAL_API_KEY`
 */
export const mistral = createMistral(process.env.MISTRAL_API_KEY!)
