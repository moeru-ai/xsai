/* eslint-disable perfectionist/sort-named-imports */

import process from 'node:process'

import {
  createAlibaba,
  createAlibabaCn,
  createBailing,
  createBaseten,
  createCerebras,
  createChutes,
  createCortecs,
  createDeepinfra,
  createDeepSeek,
  createFastrouter,
  createFireworks,
  createGithubCopilot,
  createGithubModels,
  createGoogleGenerativeAI,
  createGroq,
  createHelicone,
  createHuggingface,
  createIflowcn,
  createInception,
  createInference,
  createIoNet,
  createKimiForCoding,
  createLlama,
  createLmstudio,
  createLucidquery,
  createMinimax,
  createMinimaxCn,
  createMistral,
  createModelscope,
  createMoonshotai,
  createMoonshotaiCn,
  createMorph,
  createNebius,
  createNvidia,
  createOllamaCloud,
  createOpenAI,
  createOpencode,
  createOvhcloud,
  createPerplexity,
  createPoe,
  createRequesty,
  createScaleway,
  createSiliconFlow,
  createSiliconflowCn,
  createSubmodel,
  createSynthetic,
  createUpstage,
  createVenice,
  createVultr,
  createWandb,
  createXai,
  createXiaomi,
  createZai,
  createZaiCodingPlan,
  createZenmux,
  createZhipuai,
  createZhipuaiCodingPlan,
  createNovita,
  createStepfun,
  createTencentHunyuan,
  createOllama,
  createLitellm,
} from './create'

/**
 * Alibaba Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 * @remarks
 * - baseURL - `https://dashscope-intl.aliyuncs.com/compatible-mode/v1`
 * - apiKey - `DASHSCOPE_API_KEY`
 */
export const alibaba = createAlibaba(process.env.DASHSCOPE_API_KEY ?? '')

/**
 * Alibaba (China) Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/models}
 * @remarks
 * - baseURL - `https://dashscope.aliyuncs.com/compatible-mode/v1`
 * - apiKey - `DASHSCOPE_API_KEY`
 */
export const alibabaCn = createAlibabaCn(process.env.DASHSCOPE_API_KEY ?? '')

/**
 * Bailing Provider
 * @see {@link https://alipaytbox.yuque.com/sxs0ba/ling/intro}
 * @remarks
 * - baseURL - `https://api.tbox.cn/api/llm/v1/chat/completions`
 * - apiKey - `BAILING_API_TOKEN`
 */
export const bailing = createBailing(process.env.BAILING_API_TOKEN ?? '')

/**
 * Baseten Provider
 * @see {@link https://docs.baseten.co/development/model-apis/overview}
 * @remarks
 * - baseURL - `https://inference.baseten.co/v1`
 * - apiKey - `BASETEN_API_KEY`
 */
export const baseten = createBaseten(process.env.BASETEN_API_KEY ?? '')

/**
 * Cerebras Provider
 * @see {@link https://inference-docs.cerebras.ai/models/overview}
 * @remarks
 * - baseURL - `https://api.cerebras.ai/v1/`
 * - apiKey - `CEREBRAS_API_KEY`
 */
export const cerebras = createCerebras(process.env.CEREBRAS_API_KEY ?? '')

/**
 * Chutes Provider
 * @see {@link https://llm.chutes.ai/v1/models}
 * @remarks
 * - baseURL - `https://llm.chutes.ai/v1`
 * - apiKey - `CHUTES_API_KEY`
 */
export const chutes = createChutes(process.env.CHUTES_API_KEY ?? '')

/**
 * Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 * @remarks
 * - baseURL - `https://api.cortecs.ai/v1`
 * - apiKey - `CORTECS_API_KEY`
 */
export const cortecs = createCortecs(process.env.CORTECS_API_KEY ?? '')

/**
 * Deep Infra Provider
 * @see {@link https://deepinfra.com/models}
 * @remarks
 * - baseURL - `https://api.deepinfra.com/v1/openai/`
 * - apiKey - `DEEPINFRA_API_KEY`
 */
export const deepinfra = createDeepinfra(process.env.DEEPINFRA_API_KEY ?? '')

/**
 * DeepSeek Provider
 * @see {@link https://platform.deepseek.com/api-docs/pricing}
 * @remarks
 * - baseURL - `https://api.deepseek.com`
 * - apiKey - `DEEPSEEK_API_KEY`
 */
export const deepseek = createDeepSeek(process.env.DEEPSEEK_API_KEY ?? '')

/**
 * FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 * @remarks
 * - baseURL - `https://go.fastrouter.ai/api/v1`
 * - apiKey - `FASTROUTER_API_KEY`
 */
export const fastrouter = createFastrouter(process.env.FASTROUTER_API_KEY ?? '')

/**
 * Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 * @remarks
 * - baseURL - `https://api.fireworks.ai/inference/v1/`
 * - apiKey - `FIREWORKS_API_KEY`
 */
export const fireworks = createFireworks(process.env.FIREWORKS_API_KEY ?? '')

/**
 * GitHub Copilot Provider
 * @see {@link https://docs.github.com/en/copilot}
 * @remarks
 * - baseURL - `https://api.githubcopilot.com`
 * - apiKey - `GITHUB_TOKEN`
 */
export const githubCopilot = createGithubCopilot(process.env.GITHUB_TOKEN ?? '')

/**
 * GitHub Models Provider
 * @see {@link https://docs.github.com/en/github-models}
 * @remarks
 * - baseURL - `https://models.github.ai/inference`
 * - apiKey - `GITHUB_TOKEN`
 */
export const githubModels = createGithubModels(process.env.GITHUB_TOKEN ?? '')

/**
 * Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/pricing}
 * @remarks
 * - baseURL - `https://generativelanguage.googleapis.com/v1beta/openai/`
 * - apiKey - `GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY`
 */
export const google = createGoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? '')

/**
 * Groq Provider
 * @see {@link https://console.groq.com/docs/models}
 * @remarks
 * - baseURL - `https://api.groq.com/openai/v1/`
 * - apiKey - `GROQ_API_KEY`
 */
export const groq = createGroq(process.env.GROQ_API_KEY ?? '')

/**
 * Helicone Provider
 * @see {@link https://helicone.ai/models}
 * @remarks
 * - baseURL - `https://ai-gateway.helicone.ai/v1`
 * - apiKey - `HELICONE_API_KEY`
 */
export const helicone = createHelicone(process.env.HELICONE_API_KEY ?? '')

/**
 * Hugging Face Provider
 * @see {@link https://huggingface.co/docs/inference-providers}
 * @remarks
 * - baseURL - `https://router.huggingface.co/v1`
 * - apiKey - `HF_TOKEN`
 */
export const huggingface = createHuggingface(process.env.HF_TOKEN ?? '')

/**
 * iFlow Provider
 * @see {@link https://platform.iflow.cn/en/docs}
 * @remarks
 * - baseURL - `https://apis.iflow.cn/v1`
 * - apiKey - `IFLOW_API_KEY`
 */
export const iflowcn = createIflowcn(process.env.IFLOW_API_KEY ?? '')

/**
 * Inception Provider
 * @see {@link https://platform.inceptionlabs.ai/docs}
 * @remarks
 * - baseURL - `https://api.inceptionlabs.ai/v1/`
 * - apiKey - `INCEPTION_API_KEY`
 */
export const inception = createInception(process.env.INCEPTION_API_KEY ?? '')

/**
 * Inference Provider
 * @see {@link https://inference.net/models}
 * @remarks
 * - baseURL - `https://inference.net/v1`
 * - apiKey - `INFERENCE_API_KEY`
 */
export const inference = createInference(process.env.INFERENCE_API_KEY ?? '')

/**
 * IO.NET Provider
 * @see {@link https://io.net/docs/guides/intelligence/io-intelligence}
 * @remarks
 * - baseURL - `https://api.intelligence.io.solutions/api/v1`
 * - apiKey - `IOINTELLIGENCE_API_KEY`
 */
export const ioNet = createIoNet(process.env.IOINTELLIGENCE_API_KEY ?? '')

/**
 * Kimi For Coding Provider
 * @see {@link https://www.kimi.com/coding/docs/en/third-party-agents.html}
 * @remarks
 * - baseURL - `https://api.kimi.com/coding/v1`
 * - apiKey - `KIMI_API_KEY`
 */
export const kimiForCoding = createKimiForCoding(process.env.KIMI_API_KEY ?? '')

/**
 * Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 * @remarks
 * - baseURL - `https://api.llama.com/compat/v1/`
 * - apiKey - `LLAMA_API_KEY`
 */
export const llama = createLlama(process.env.LLAMA_API_KEY ?? '')

/**
 * LMStudio Provider
 * @see {@link https://lmstudio.ai/models}
 * @remarks
 * - baseURL - `http://127.0.0.1:1234/v1`
 * - apiKey - `LMSTUDIO_API_KEY`
 */
export const lmstudio = createLmstudio(process.env.LMSTUDIO_API_KEY ?? '')

/**
 * LucidQuery AI Provider
 * @see {@link https://lucidquery.com/api/docs}
 * @remarks
 * - baseURL - `https://lucidquery.com/api/v1`
 * - apiKey - `LUCIDQUERY_API_KEY`
 */
export const lucidquery = createLucidquery(process.env.LUCIDQUERY_API_KEY ?? '')

/**
 * MiniMax Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 * @remarks
 * - baseURL - `https://api.minimax.io/v1/`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimax = createMinimax(process.env.MINIMAX_API_KEY ?? '')

/**
 * MiniMax (China) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 * @remarks
 * - baseURL - `https://api.minimaxi.com/v1/`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimaxCn = createMinimaxCn(process.env.MINIMAX_API_KEY ?? '')

/**
 * Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 * @remarks
 * - baseURL - `https://api.mistral.ai/v1/`
 * - apiKey - `MISTRAL_API_KEY`
 */
export const mistral = createMistral(process.env.MISTRAL_API_KEY ?? '')

/**
 * ModelScope Provider
 * @see {@link https://modelscope.cn/docs/model-service/API-Inference/intro}
 * @remarks
 * - baseURL - `https://api-inference.modelscope.cn/v1`
 * - apiKey - `MODELSCOPE_API_KEY`
 */
export const modelscope = createModelscope(process.env.MODELSCOPE_API_KEY ?? '')

/**
 * Moonshot AI Provider
 * @see {@link https://platform.moonshot.ai/docs/api/chat}
 * @remarks
 * - baseURL - `https://api.moonshot.ai/v1`
 * - apiKey - `MOONSHOT_API_KEY`
 */
export const moonshotai = createMoonshotai(process.env.MOONSHOT_API_KEY ?? '')

/**
 * Moonshot AI (China) Provider
 * @see {@link https://platform.moonshot.cn/docs/api/chat}
 * @remarks
 * - baseURL - `https://api.moonshot.cn/v1`
 * - apiKey - `MOONSHOT_API_KEY`
 */
export const moonshotaiCn = createMoonshotaiCn(process.env.MOONSHOT_API_KEY ?? '')

/**
 * Morph Provider
 * @see {@link https://docs.morphllm.com/api-reference/introduction}
 * @remarks
 * - baseURL - `https://api.morphllm.com/v1`
 * - apiKey - `MORPH_API_KEY`
 */
export const morph = createMorph(process.env.MORPH_API_KEY ?? '')

/**
 * Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 * @remarks
 * - baseURL - `https://api.tokenfactory.nebius.com/v1`
 * - apiKey - `NEBIUS_API_KEY`
 */
export const nebius = createNebius(process.env.NEBIUS_API_KEY ?? '')

/**
 * Nvidia Provider
 * @see {@link https://docs.api.nvidia.com/nim/}
 * @remarks
 * - baseURL - `https://integrate.api.nvidia.com/v1`
 * - apiKey - `NVIDIA_API_KEY`
 */
export const nvidia = createNvidia(process.env.NVIDIA_API_KEY ?? '')

/**
 * Ollama Cloud Provider
 * @see {@link https://docs.ollama.com/cloud}
 * @remarks
 * - baseURL - `https://ollama.com/v1`
 * - apiKey - `OLLAMA_API_KEY`
 */
export const ollamaCloud = createOllamaCloud(process.env.OLLAMA_API_KEY ?? '')

/**
 * OpenAI Provider
 * @see {@link https://platform.openai.com/docs/models}
 * @remarks
 * - baseURL - `https://api.openai.com/v1/`
 * - apiKey - `OPENAI_API_KEY`
 */
export const openai = createOpenAI(process.env.OPENAI_API_KEY ?? '')

/**
 * OpenCode Zen Provider
 * @see {@link https://opencode.ai/docs/zen}
 * @remarks
 * - baseURL - `https://opencode.ai/zen/v1`
 * - apiKey - `OPENCODE_API_KEY`
 */
export const opencode = createOpencode(process.env.OPENCODE_API_KEY ?? '')

/**
 * OVHcloud AI Endpoints Provider
 * @see {@link https://www.ovhcloud.com/en/public-cloud/ai-endpoints/catalog//}
 * @remarks
 * - baseURL - `https://oai.endpoints.kepler.ai.cloud.ovh.net/v1`
 * - apiKey - `OVHCLOUD_API_KEY`
 */
export const ovhcloud = createOvhcloud(process.env.OVHCLOUD_API_KEY ?? '')

/**
 * Perplexity Provider
 * @see {@link https://docs.perplexity.ai}
 * @remarks
 * - baseURL - `https://api.perplexity.ai/`
 * - apiKey - `PERPLEXITY_API_KEY`
 */
export const perplexity = createPerplexity(process.env.PERPLEXITY_API_KEY ?? '')

/**
 * Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 * @remarks
 * - baseURL - `https://api.poe.com/v1`
 * - apiKey - `POE_API_KEY`
 */
export const poe = createPoe(process.env.POE_API_KEY ?? '')

/**
 * Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 * @remarks
 * - baseURL - `https://router.requesty.ai/v1`
 * - apiKey - `REQUESTY_API_KEY`
 */
export const requesty = createRequesty(process.env.REQUESTY_API_KEY ?? '')

/**
 * Scaleway Provider
 * @see {@link https://www.scaleway.com/en/docs/generative-apis/}
 * @remarks
 * - baseURL - `https://api.scaleway.ai/v1`
 * - apiKey - `SCALEWAY_API_KEY`
 */
export const scaleway = createScaleway(process.env.SCALEWAY_API_KEY ?? '')

/**
 * SiliconFlow Provider
 * @see {@link https://cloud.siliconflow.com/models}
 * @remarks
 * - baseURL - `https://api.siliconflow.com/v1`
 * - apiKey - `SILICONFLOW_API_KEY`
 */
export const siliconflow = createSiliconFlow(process.env.SILICONFLOW_API_KEY ?? '')

/**
 * SiliconFlow (China) Provider
 * @see {@link https://cloud.siliconflow.com/models}
 * @remarks
 * - baseURL - `https://api.siliconflow.cn/v1`
 * - apiKey - `SILICONFLOW_API_KEY`
 */
export const siliconflowCn = createSiliconflowCn(process.env.SILICONFLOW_API_KEY ?? '')

/**
 * submodel Provider
 * @see {@link https://submodel.gitbook.io}
 * @remarks
 * - baseURL - `https://llm.submodel.ai/v1`
 * - apiKey - `SUBMODEL_INSTAGEN_ACCESS_KEY`
 */
export const submodel = createSubmodel(process.env.SUBMODEL_INSTAGEN_ACCESS_KEY ?? '')

/**
 * Synthetic Provider
 * @see {@link https://synthetic.new/pricing}
 * @remarks
 * - baseURL - `https://api.synthetic.new/v1`
 * - apiKey - `SYNTHETIC_API_KEY`
 */
export const synthetic = createSynthetic(process.env.SYNTHETIC_API_KEY ?? '')

/**
 * Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 * @remarks
 * - baseURL - `https://api.upstage.ai`
 * - apiKey - `UPSTAGE_API_KEY`
 */
export const upstage = createUpstage(process.env.UPSTAGE_API_KEY ?? '')

/**
 * Venice AI Provider
 * @see {@link https://docs.venice.ai}
 * @remarks
 * - baseURL - `https://api.venice.ai/api/v1`
 * - apiKey - `VENICE_API_KEY`
 */
export const venice = createVenice(process.env.VENICE_API_KEY ?? '')

/**
 * Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 * @remarks
 * - baseURL - `https://api.vultrinference.com/v1`
 * - apiKey - `VULTR_API_KEY`
 */
export const vultr = createVultr(process.env.VULTR_API_KEY ?? '')

/**
 * Weights & Biases Provider
 * @see {@link https://weave-docs.wandb.ai/guides/integrations/inference/}
 * @remarks
 * - baseURL - `https://api.inference.wandb.ai/v1`
 * - apiKey - `WANDB_API_KEY`
 */
export const wandb = createWandb(process.env.WANDB_API_KEY ?? '')

/**
 * xAI Provider
 * @see {@link https://docs.x.ai/docs/models}
 * @remarks
 * - baseURL - `https://api.x.ai/v1/`
 * - apiKey - `XAI_API_KEY`
 */
export const xai = createXai(process.env.XAI_API_KEY ?? '')

/**
 * Xiaomi Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 * @remarks
 * - baseURL - `https://api.xiaomimimo.com/v1`
 * - apiKey - `XIAOMI_API_KEY`
 */
export const xiaomi = createXiaomi(process.env.XIAOMI_API_KEY ?? '')

/**
 * Z.AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 * @remarks
 * - baseURL - `https://api.z.ai/api/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zai = createZai(process.env.ZHIPU_API_KEY ?? '')

/**
 * Z.AI Coding Plan Provider
 * @see {@link https://docs.z.ai/devpack/overview}
 * @remarks
 * - baseURL - `https://api.z.ai/api/coding/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zaiCodingPlan = createZaiCodingPlan(process.env.ZHIPU_API_KEY ?? '')

/**
 * ZenMux Provider
 * @see {@link https://docs.zenmux.ai}
 * @remarks
 * - baseURL - `https://zenmux.ai/api/v1`
 * - apiKey - `ZENMUX_API_KEY`
 */
export const zenmux = createZenmux(process.env.ZENMUX_API_KEY ?? '')

/**
 * Zhipu AI Provider
 * @see {@link https://docs.z.ai/guides/overview/pricing}
 * @remarks
 * - baseURL - `https://open.bigmodel.cn/api/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zhipuai = createZhipuai(process.env.ZHIPU_API_KEY ?? '')

/**
 * Zhipu AI Coding Plan Provider
 * @see {@link https://docs.bigmodel.cn/cn/coding-plan/overview}
 * @remarks
 * - baseURL - `https://open.bigmodel.cn/api/coding/paas/v4`
 * - apiKey - `ZHIPU_API_KEY`
 */
export const zhipuaiCodingPlan = createZhipuaiCodingPlan(process.env.ZHIPU_API_KEY ?? '')

/**
 * Novita AI Provider
 * @see {@link https://novita.ai/docs/guides/llm-api#api-integration}
 * @remarks
 * - baseURL - `https://api.novita.ai/v3/openai/`
 * - apiKey - `NOVITA_API_KEY`
 */
export const novita = createNovita(process.env.NOVITA_API_KEY ?? '')

/**
 * StepFun Provider
 * @see {@link https://www.stepfun.com}
 * @remarks
 * - baseURL - `https://api.stepfun.com/v1/`
 * - apiKey - `STEPFUN_API_KEY`
 */
export const stepfun = createStepfun(process.env.STEPFUN_API_KEY ?? '')

/**
 * Tencent Hunyuan Provider
 * @see {@link https://cloud.tencent.com/document/product/1729}
 * @remarks
 * - baseURL - `https://api.hunyuan.cloud.tencent.com/v1/`
 * - apiKey - `TENCENT_HUNYUAN_API_KEY`
 */
export const tencentHunyuan = createTencentHunyuan(process.env.TENCENT_HUNYUAN_API_KEY ?? '')

/**
 * Ollama Provider
 * @see {@link https://docs.ollama.com}
 * @remarks
 * - baseURL - `http://localhost:11434/v1/`
 * - apiKey - `OLLAMA_API_KEY`
 */
export const ollama = createOllama(process.env.OLLAMA_API_KEY ?? '')

/**
 * LiteLLM Provider
 * @see {@link https://docs.litellm.ai}
 * @remarks
 * - baseURL - `http://localhost:4000/v1/`
 * - apiKey - `LITELLM_API_KEY`
 */
export const litellm = createLitellm(process.env.LITELLM_API_KEY ?? '')
