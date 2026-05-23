/* eslint-disable perfectionist/sort-named-imports */

import process from 'node:process'

import {
  createAbacus,
  createAbliterationAi,
  createAlibaba,
  createAlibabaCn,
  createAlibabaCodingPlan,
  createAlibabaCodingPlanCn,
  createAmbient,
  createAtomicChat,
  createAuriko,
  createBailing,
  createBaseten,
  createBerget,
  createCerebras,
  createChutes,
  createClaudinio,
  createCloudferroSherlock,
  createCohere,
  createCortecs,
  createCrof,
  createDeepinfra,
  createDeepSeek,
  createDigitalocean,
  createDinference,
  createDrun,
  createEvroc,
  createFastrouter,
  createFirepass,
  createFireworks,
  createFriendli,
  createFrogbot,
  createGithubCopilot,
  createGithubModels,
  createGmicloud,
  createGoogleGenerativeAI,
  createGroq,
  createHelicone,
  createHpcAi,
  createHuggingface,
  createIflowcn,
  createInception,
  createInceptron,
  createInference,
  createIoNet,
  createJiekou,
  createKilo,
  createKimiForCoding,
  createKuaeCloudCodingPlan,
  createLilac,
  createLlama,
  createLlmgateway,
  createLmstudio,
  createLucidquery,
  createMeganova,
  createMinimax,
  createMinimaxCn,
  createMinimaxCnCodingPlan,
  createMinimaxCodingPlan,
  createMistral,
  createMixlayer,
  createMoark,
  createModelscope,
  createMoonshotai,
  createMoonshotaiCn,
  createMorph,
  createNanoGpt,
  createNearai,
  createNebius,
  createNeuralwatt,
  createNova,
  createNovitaAi,
  createNvidia,
  createOllamaCloud,
  createOpenAI,
  createOpencode,
  createOpencodeGo,
  createOrcarouter,
  createOvhcloud,
  createPerplexity,
  createPerplexityAgent,
  createPoe,
  createPrivatemodeAi,
  createQihangAi,
  createQiniuAi,
  createRegoloAi,
  createRequesty,
  createRoutingRun,
  createSarvam,
  createScaleway,
  createSiliconFlow,
  createSiliconflowCn,
  createStackit,
  createStepfun,
  createStepfunAi,
  createSubmodel,
  createSynthetic,
  createTencentCodingPlan,
  createTencentTokenhub,
  createTheGridAi,
  createUmansAiCodingPlan,
  createUpstage,
  createVenice,
  createVivgrid,
  createVultr,
  createWaferAi,
  createWandb,
  createXai,
  createXiaomi,
  createXiaomiTokenPlanAms,
  createXiaomiTokenPlanCn,
  createXiaomiTokenPlanSgp,
  createXpersona,
  createZai,
  createZaiCodingPlan,
  createZenmux,
  createZhipuai,
  createZhipuaiCodingPlan,
  createQianfan,
  createTencentHunyuan,
  createOllama,
  createLitellm,
} from './create'

/**
 * Abacus Provider
 * @see {@link https://abacus.ai/help/api}
 * @remarks
 * - baseURL - `https://routellm.abacus.ai/v1`
 * - apiKey - `ABACUS_API_KEY`
 */
export const abacus = createAbacus(process.env.ABACUS_API_KEY ?? '')

/**
 * abliteration.ai Provider
 * @see {@link https://docs.abliteration.ai/models}
 * @remarks
 * - baseURL - `https://api.abliteration.ai/v1`
 * - apiKey - `ABLIT_KEY`
 */
export const abliterationAi = createAbliterationAi(process.env.ABLIT_KEY ?? '')

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
 * Alibaba Coding Plan Provider
 * @see {@link https://www.alibabacloud.com/help/en/model-studio/coding-plan}
 * @remarks
 * - baseURL - `https://coding-intl.dashscope.aliyuncs.com/v1`
 * - apiKey - `ALIBABA_CODING_PLAN_API_KEY`
 */
export const alibabaCodingPlan = createAlibabaCodingPlan(process.env.ALIBABA_CODING_PLAN_API_KEY ?? '')

/**
 * Alibaba Coding Plan (China) Provider
 * @see {@link https://help.aliyun.com/zh/model-studio/coding-plan}
 * @remarks
 * - baseURL - `https://coding.dashscope.aliyuncs.com/v1`
 * - apiKey - `ALIBABA_CODING_PLAN_API_KEY`
 */
export const alibabaCodingPlanCn = createAlibabaCodingPlanCn(process.env.ALIBABA_CODING_PLAN_API_KEY ?? '')

/**
 * Ambient Provider
 * @see {@link https://ambient.xyz}
 * @remarks
 * - baseURL - `https://api.ambient.xyz/v1`
 * - apiKey - `AMBIENT_API_KEY`
 */
export const ambient = createAmbient(process.env.AMBIENT_API_KEY ?? '')

/**
 * Atomic Chat Provider
 * @see {@link https://atomic.chat}
 * @remarks
 * - baseURL - `http://127.0.0.1:1337/v1`
 * - apiKey - `ATOMIC_CHAT_API_KEY`
 */
export const atomicChat = createAtomicChat(process.env.ATOMIC_CHAT_API_KEY ?? '')

/**
 * Auriko Provider
 * @see {@link https://docs.auriko.ai}
 * @remarks
 * - baseURL - `https://api.auriko.ai/v1`
 * - apiKey - `AURIKO_API_KEY`
 */
export const auriko = createAuriko(process.env.AURIKO_API_KEY ?? '')

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
 * Berget.AI Provider
 * @see {@link https://api.berget.ai}
 * @remarks
 * - baseURL - `https://api.berget.ai/v1`
 * - apiKey - `BERGET_API_KEY`
 */
export const berget = createBerget(process.env.BERGET_API_KEY ?? '')

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
 * Claudinio Provider
 * @see {@link https://claudin.io}
 * @remarks
 * - baseURL - `https://api.claudin.io/v1`
 * - apiKey - `CLAUDINIO_API_KEY`
 */
export const claudinio = createClaudinio(process.env.CLAUDINIO_API_KEY ?? '')

/**
 * CloudFerro Sherlock Provider
 * @see {@link https://docs.sherlock.cloudferro.com/}
 * @remarks
 * - baseURL - `https://api-sherlock.cloudferro.com/openai/v1/`
 * - apiKey - `CLOUDFERRO_SHERLOCK_API_KEY`
 */
export const cloudferroSherlock = createCloudferroSherlock(process.env.CLOUDFERRO_SHERLOCK_API_KEY ?? '')

/**
 * Cohere Provider
 * @see {@link https://docs.cohere.com/docs/models}
 * @remarks
 * - baseURL - `https://api.cohere.ai/compatibility/v1/`
 * - apiKey - `COHERE_API_KEY`
 */
export const cohere = createCohere(process.env.COHERE_API_KEY ?? '')

/**
 * Cortecs Provider
 * @see {@link https://api.cortecs.ai/v1/models}
 * @remarks
 * - baseURL - `https://api.cortecs.ai/v1`
 * - apiKey - `CORTECS_API_KEY`
 */
export const cortecs = createCortecs(process.env.CORTECS_API_KEY ?? '')

/**
 * CrofAI Provider
 * @see {@link https://crof.ai/docs}
 * @remarks
 * - baseURL - `https://crof.ai/v1`
 * - apiKey - `CROF_API_KEY`
 */
export const crof = createCrof(process.env.CROF_API_KEY ?? '')

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
 * @see {@link https://api-docs.deepseek.com/quick_start/pricing}
 * @remarks
 * - baseURL - `https://api.deepseek.com`
 * - apiKey - `DEEPSEEK_API_KEY`
 */
export const deepseek = createDeepSeek(process.env.DEEPSEEK_API_KEY ?? '')

/**
 * DigitalOcean Provider
 * @see {@link https://docs.digitalocean.com/products/gradient-ai-platform/details/models/}
 * @remarks
 * - baseURL - `https://inference.do-ai.run/v1`
 * - apiKey - `DIGITALOCEAN_ACCESS_TOKEN`
 */
export const digitalocean = createDigitalocean(process.env.DIGITALOCEAN_ACCESS_TOKEN ?? '')

/**
 * DInference Provider
 * @see {@link https://dinference.com}
 * @remarks
 * - baseURL - `https://api.dinference.com/v1`
 * - apiKey - `DINFERENCE_API_KEY`
 */
export const dinference = createDinference(process.env.DINFERENCE_API_KEY ?? '')

/**
 * D.Run (China) Provider
 * @see {@link https://www.d.run}
 * @remarks
 * - baseURL - `https://chat.d.run/v1`
 * - apiKey - `DRUN_API_KEY`
 */
export const drun = createDrun(process.env.DRUN_API_KEY ?? '')

/**
 * evroc Provider
 * @see {@link https://docs.evroc.com/products/think/overview.html}
 * @remarks
 * - baseURL - `https://models.think.evroc.com/v1`
 * - apiKey - `EVROC_API_KEY`
 */
export const evroc = createEvroc(process.env.EVROC_API_KEY ?? '')

/**
 * FastRouter Provider
 * @see {@link https://fastrouter.ai/models}
 * @remarks
 * - baseURL - `https://go.fastrouter.ai/api/v1`
 * - apiKey - `FASTROUTER_API_KEY`
 */
export const fastrouter = createFastrouter(process.env.FASTROUTER_API_KEY ?? '')

/**
 * Fireworks (Firepass) Provider
 * @see {@link https://docs.fireworks.ai/firepass}
 * @remarks
 * - baseURL - `https://api.fireworks.ai/inference/v1/`
 * - apiKey - `FIREPASS_API_KEY`
 */
export const firepass = createFirepass(process.env.FIREPASS_API_KEY ?? '')

/**
 * Fireworks AI Provider
 * @see {@link https://fireworks.ai/docs/}
 * @remarks
 * - baseURL - `https://api.fireworks.ai/inference/v1/`
 * - apiKey - `FIREWORKS_API_KEY`
 */
export const fireworks = createFireworks(process.env.FIREWORKS_API_KEY ?? '')

/**
 * Friendli Provider
 * @see {@link https://friendli.ai/docs/guides/serverless_endpoints/introduction}
 * @remarks
 * - baseURL - `https://api.friendli.ai/serverless/v1`
 * - apiKey - `FRIENDLI_TOKEN`
 */
export const friendli = createFriendli(process.env.FRIENDLI_TOKEN ?? '')

/**
 * FrogBot Provider
 * @see {@link https://docs.frogbot.ai}
 * @remarks
 * - baseURL - `https://app.frogbot.ai/api/v1`
 * - apiKey - `FROGBOT_API_KEY`
 */
export const frogbot = createFrogbot(process.env.FROGBOT_API_KEY ?? '')

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
 * GMI Cloud Provider
 * @see {@link https://docs.gmicloud.ai/inference-engine/api-reference/llm-api-reference}
 * @remarks
 * - baseURL - `https://api.gmi-serving.com/v1`
 * - apiKey - `GMICLOUD_API_KEY`
 */
export const gmicloud = createGmicloud(process.env.GMICLOUD_API_KEY ?? '')

/**
 * Google Provider
 * @see {@link https://ai.google.dev/gemini-api/docs/models}
 * @remarks
 * - baseURL - `https://generativelanguage.googleapis.com/v1beta/openai/`
 * - apiKey - `GOOGLE_API_KEY or GOOGLE_GENERATIVE_AI_API_KEY or GEMINI_API_KEY`
 */
export const google = createGoogleGenerativeAI(process.env.GOOGLE_API_KEY ?? process.env.GOOGLE_GENERATIVE_AI_API_KEY ?? process.env.GEMINI_API_KEY ?? '')

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
 * HPC-AI Provider
 * @see {@link https://www.hpc-ai.com/doc/docs/quickstart/}
 * @remarks
 * - baseURL - `https://api.hpc-ai.com/inference/v1`
 * - apiKey - `HPC_AI_API_KEY`
 */
export const hpcAi = createHpcAi(process.env.HPC_AI_API_KEY ?? '')

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
 * Inceptron Provider
 * @see {@link https://docs.inceptron.io}
 * @remarks
 * - baseURL - `https://api.inceptron.io/v1`
 * - apiKey - `INCEPTRON_API_KEY`
 */
export const inceptron = createInceptron(process.env.INCEPTRON_API_KEY ?? '')

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
 * Jiekou.AI Provider
 * @see {@link https://docs.jiekou.ai/docs/support/quickstart?utm_source=github_models.dev}
 * @remarks
 * - baseURL - `https://api.jiekou.ai/openai`
 * - apiKey - `JIEKOU_API_KEY`
 */
export const jiekou = createJiekou(process.env.JIEKOU_API_KEY ?? '')

/**
 * Kilo Gateway Provider
 * @see {@link https://kilo.ai}
 * @remarks
 * - baseURL - `https://api.kilo.ai/api/gateway`
 * - apiKey - `KILO_API_KEY`
 */
export const kilo = createKilo(process.env.KILO_API_KEY ?? '')

/**
 * Kimi For Coding Provider
 * @see {@link https://www.kimi.com/coding/docs/en/third-party-agents.html}
 * @remarks
 * - baseURL - `https://api.kimi.com/coding/v1`
 * - apiKey - `KIMI_API_KEY`
 */
export const kimiForCoding = createKimiForCoding(process.env.KIMI_API_KEY ?? '')

/**
 * KUAE Cloud Coding Plan Provider
 * @see {@link https://docs.mthreads.com/kuaecloud/kuaecloud-doc-online/coding_plan/}
 * @remarks
 * - baseURL - `https://coding-plan-endpoint.kuaecloud.net/v1`
 * - apiKey - `KUAE_API_KEY`
 */
export const kuaeCloudCodingPlan = createKuaeCloudCodingPlan(process.env.KUAE_API_KEY ?? '')

/**
 * Lilac Provider
 * @see {@link https://docs.getlilac.com/inference/models}
 * @remarks
 * - baseURL - `https://api.getlilac.com/v1`
 * - apiKey - `LILAC_API_KEY`
 */
export const lilac = createLilac(process.env.LILAC_API_KEY ?? '')

/**
 * Llama Provider
 * @see {@link https://llama.developer.meta.com/docs/models}
 * @remarks
 * - baseURL - `https://api.llama.com/compat/v1/`
 * - apiKey - `LLAMA_API_KEY`
 */
export const llama = createLlama(process.env.LLAMA_API_KEY ?? '')

/**
 * LLM Gateway Provider
 * @see {@link https://llmgateway.io/docs}
 * @remarks
 * - baseURL - `https://api.llmgateway.io/v1`
 * - apiKey - `LLMGATEWAY_API_KEY`
 */
export const llmgateway = createLlmgateway(process.env.LLMGATEWAY_API_KEY ?? '')

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
 * Meganova Provider
 * @see {@link https://docs.meganova.ai}
 * @remarks
 * - baseURL - `https://api.meganova.ai/v1`
 * - apiKey - `MEGANOVA_API_KEY`
 */
export const meganova = createMeganova(process.env.MEGANOVA_API_KEY ?? '')

/**
 * MiniMax (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/guides/quickstart}
 * @remarks
 * - baseURL - `https://api.minimax.io/v1/`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimax = createMinimax(process.env.MINIMAX_API_KEY ?? '')

/**
 * MiniMax (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/guides/quickstart}
 * @remarks
 * - baseURL - `https://api.minimaxi.com/v1/`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimaxCn = createMinimaxCn(process.env.MINIMAX_API_KEY ?? '')

/**
 * MiniMax Token Plan (minimaxi.com) Provider
 * @see {@link https://platform.minimaxi.com/docs/token-plan/intro}
 * @remarks
 * - baseURL - `https://api.minimaxi.com/anthropic/v1`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimaxCnCodingPlan = createMinimaxCnCodingPlan(process.env.MINIMAX_API_KEY ?? '')

/**
 * MiniMax Token Plan (minimax.io) Provider
 * @see {@link https://platform.minimax.io/docs/token-plan/intro}
 * @remarks
 * - baseURL - `https://api.minimax.io/anthropic/v1`
 * - apiKey - `MINIMAX_API_KEY`
 */
export const minimaxCodingPlan = createMinimaxCodingPlan(process.env.MINIMAX_API_KEY ?? '')

/**
 * Mistral Provider
 * @see {@link https://docs.mistral.ai/getting-started/models/}
 * @remarks
 * - baseURL - `https://api.mistral.ai/v1/`
 * - apiKey - `MISTRAL_API_KEY`
 */
export const mistral = createMistral(process.env.MISTRAL_API_KEY ?? '')

/**
 * Mixlayer Provider
 * @see {@link https://docs.mixlayer.com}
 * @remarks
 * - baseURL - `https://models.mixlayer.ai/v1`
 * - apiKey - `MIXLAYER_API_KEY`
 */
export const mixlayer = createMixlayer(process.env.MIXLAYER_API_KEY ?? '')

/**
 * Moark Provider
 * @see {@link https://moark.com/docs/openapi/v1#tag/%E6%96%87%E6%9C%AC%E7%94%9F%E6%88%90}
 * @remarks
 * - baseURL - `https://moark.com/v1`
 * - apiKey - `MOARK_API_KEY`
 */
export const moark = createMoark(process.env.MOARK_API_KEY ?? '')

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
 * NanoGPT Provider
 * @see {@link https://docs.nano-gpt.com}
 * @remarks
 * - baseURL - `https://nano-gpt.com/api/v1`
 * - apiKey - `NANO_GPT_API_KEY`
 */
export const nanoGpt = createNanoGpt(process.env.NANO_GPT_API_KEY ?? '')

/**
 * NEAR AI Cloud Provider
 * @see {@link https://docs.near.ai/}
 * @remarks
 * - baseURL - `https://cloud-api.near.ai/v1`
 * - apiKey - `NEARAI_API_KEY`
 */
export const nearai = createNearai(process.env.NEARAI_API_KEY ?? '')

/**
 * Nebius Token Factory Provider
 * @see {@link https://docs.tokenfactory.nebius.com/}
 * @remarks
 * - baseURL - `https://api.tokenfactory.nebius.com/v1`
 * - apiKey - `NEBIUS_API_KEY`
 */
export const nebius = createNebius(process.env.NEBIUS_API_KEY ?? '')

/**
 * Neuralwatt Provider
 * @see {@link https://portal.neuralwatt.com/docs}
 * @remarks
 * - baseURL - `https://api.neuralwatt.com/v1`
 * - apiKey - `NEURALWATT_API_KEY`
 */
export const neuralwatt = createNeuralwatt(process.env.NEURALWATT_API_KEY ?? '')

/**
 * Nova Provider
 * @see {@link https://nova.amazon.com/dev/documentation}
 * @remarks
 * - baseURL - `https://api.nova.amazon.com/v1`
 * - apiKey - `NOVA_API_KEY`
 */
export const nova = createNova(process.env.NOVA_API_KEY ?? '')

/**
 * NovitaAI Provider
 * @see {@link https://novita.ai/docs/guides/introduction}
 * @remarks
 * - baseURL - `https://api.novita.ai/openai`
 * - apiKey - `NOVITA_API_KEY`
 */
export const novitaAi = createNovitaAi(process.env.NOVITA_API_KEY ?? '')

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
 * OpenCode Go Provider
 * @see {@link https://opencode.ai/docs/zen}
 * @remarks
 * - baseURL - `https://opencode.ai/zen/go/v1`
 * - apiKey - `OPENCODE_API_KEY`
 */
export const opencodeGo = createOpencodeGo(process.env.OPENCODE_API_KEY ?? '')

/**
 * OrcaRouter Provider
 * @see {@link https://docs.orcarouter.ai}
 * @remarks
 * - baseURL - `https://api.orcarouter.ai/v1`
 * - apiKey - `ORCAROUTER_API_KEY`
 */
export const orcarouter = createOrcarouter(process.env.ORCAROUTER_API_KEY ?? '')

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
 * Perplexity Agent Provider
 * @see {@link https://docs.perplexity.ai/docs/agent-api/models}
 * @remarks
 * - baseURL - `https://api.perplexity.ai/v1`
 * - apiKey - `PERPLEXITY_API_KEY`
 */
export const perplexityAgent = createPerplexityAgent(process.env.PERPLEXITY_API_KEY ?? '')

/**
 * Poe Provider
 * @see {@link https://creator.poe.com/docs/external-applications/openai-compatible-api}
 * @remarks
 * - baseURL - `https://api.poe.com/v1`
 * - apiKey - `POE_API_KEY`
 */
export const poe = createPoe(process.env.POE_API_KEY ?? '')

/**
 * Privatemode AI Provider
 * @see {@link https://docs.privatemode.ai/api/overview}
 * @remarks
 * - baseURL - `http://localhost:8080/v1`
 * - apiKey - `PRIVATEMODE_API_KEY`
 */
export const privatemodeAi = createPrivatemodeAi(process.env.PRIVATEMODE_API_KEY ?? '')

/**
 * QiHang Provider
 * @see {@link https://www.qhaigc.net/docs}
 * @remarks
 * - baseURL - `https://api.qhaigc.net/v1`
 * - apiKey - `QIHANG_API_KEY`
 */
export const qihangAi = createQihangAi(process.env.QIHANG_API_KEY ?? '')

/**
 * Qiniu Provider
 * @see {@link https://developer.qiniu.com/aitokenapi}
 * @remarks
 * - baseURL - `https://api.qnaigc.com/v1`
 * - apiKey - `QINIU_API_KEY`
 */
export const qiniuAi = createQiniuAi(process.env.QINIU_API_KEY ?? '')

/**
 * Regolo AI Provider
 * @see {@link https://docs.regolo.ai/}
 * @remarks
 * - baseURL - `https://api.regolo.ai/v1`
 * - apiKey - `REGOLO_API_KEY`
 */
export const regoloAi = createRegoloAi(process.env.REGOLO_API_KEY ?? '')

/**
 * Requesty Provider
 * @see {@link https://requesty.ai/solution/llm-routing/models}
 * @remarks
 * - baseURL - `https://router.requesty.ai/v1`
 * - apiKey - `REQUESTY_API_KEY`
 */
export const requesty = createRequesty(process.env.REQUESTY_API_KEY ?? '')

/**
 * routing.run Provider
 * @see {@link https://docs.routing.run/api-reference/models}
 * @remarks
 * - baseURL - `https://api.routing.run/v1`
 * - apiKey - `ROUTING_RUN_API_KEY`
 */
export const routingRun = createRoutingRun(process.env.ROUTING_RUN_API_KEY ?? '')

/**
 * Sarvam AI Provider
 * @see {@link https://docs.sarvam.ai/api-reference-docs/getting-started/models}
 * @remarks
 * - baseURL - `https://api.sarvam.ai/v1`
 * - apiKey - `SARVAM_API_KEY`
 */
export const sarvam = createSarvam(process.env.SARVAM_API_KEY ?? '')

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
 * - apiKey - `SILICONFLOW_CN_API_KEY`
 */
export const siliconflowCn = createSiliconflowCn(process.env.SILICONFLOW_CN_API_KEY ?? '')

/**
 * STACKIT Provider
 * @see {@link https://docs.stackit.cloud/products/data-and-ai/ai-model-serving/basics/available-shared-models}
 * @remarks
 * - baseURL - `https://api.openai-compat.model-serving.eu01.onstackit.cloud/v1`
 * - apiKey - `STACKIT_API_KEY`
 */
export const stackit = createStackit(process.env.STACKIT_API_KEY ?? '')

/**
 * StepFun Provider
 * @see {@link https://platform.stepfun.com/docs/zh/overview/concept}
 * @remarks
 * - baseURL - `https://api.stepfun.com/v1`
 * - apiKey - `STEPFUN_API_KEY`
 */
export const stepfun = createStepfun(process.env.STEPFUN_API_KEY ?? '')

/**
 * StepFun Provider
 * @see {@link https://platform.stepfun.ai/docs/en/step-plan/integrations/open-code}
 * @remarks
 * - baseURL - `https://api.stepfun.ai/step_plan/v1`
 * - apiKey - `STEPFUN_API_KEY`
 */
export const stepfunAi = createStepfunAi(process.env.STEPFUN_API_KEY ?? '')

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
 * - baseURL - `https://api.synthetic.new/openai/v1`
 * - apiKey - `SYNTHETIC_API_KEY`
 */
export const synthetic = createSynthetic(process.env.SYNTHETIC_API_KEY ?? '')

/**
 * Tencent Coding Plan (China) Provider
 * @see {@link https://cloud.tencent.com/document/product/1772/128947}
 * @remarks
 * - baseURL - `https://api.lkeap.cloud.tencent.com/coding/v3`
 * - apiKey - `TENCENT_CODING_PLAN_API_KEY`
 */
export const tencentCodingPlan = createTencentCodingPlan(process.env.TENCENT_CODING_PLAN_API_KEY ?? '')

/**
 * Tencent TokenHub Provider
 * @see {@link https://cloud.tencent.com/document/product/1823/130050}
 * @remarks
 * - baseURL - `https://tokenhub.tencentmaas.com/v1`
 * - apiKey - `TENCENT_TOKENHUB_API_KEY`
 */
export const tencentTokenhub = createTencentTokenhub(process.env.TENCENT_TOKENHUB_API_KEY ?? '')

/**
 * The Grid AI Provider
 * @see {@link https://thegrid.ai/docs}
 * @remarks
 * - baseURL - `https://api.thegrid.ai/v1`
 * - apiKey - `THEGRIDAI_API_KEY`
 */
export const theGridAi = createTheGridAi(process.env.THEGRIDAI_API_KEY ?? '')

/**
 * Umans AI Coding Plan Provider
 * @see {@link https://app.umans.ai/offers/code/docs}
 * @remarks
 * - baseURL - `https://api.code.umans.ai/v1`
 * - apiKey - `UMANS_AI_CODING_PLAN_API_KEY`
 */
export const umansAiCodingPlan = createUmansAiCodingPlan(process.env.UMANS_AI_CODING_PLAN_API_KEY ?? '')

/**
 * Upstage Provider
 * @see {@link https://developers.upstage.ai/docs/apis/chat}
 * @remarks
 * - baseURL - `https://api.upstage.ai/v1/solar`
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
 * Vivgrid Provider
 * @see {@link https://docs.vivgrid.com/models}
 * @remarks
 * - baseURL - `https://api.vivgrid.com/v1`
 * - apiKey - `VIVGRID_API_KEY`
 */
export const vivgrid = createVivgrid(process.env.VIVGRID_API_KEY ?? '')

/**
 * Vultr Provider
 * @see {@link https://api.vultrinference.com/}
 * @remarks
 * - baseURL - `https://api.vultrinference.com/v1`
 * - apiKey - `VULTR_API_KEY`
 */
export const vultr = createVultr(process.env.VULTR_API_KEY ?? '')

/**
 * Wafer Provider
 * @see {@link https://docs.wafer.ai/wafer-pass}
 * @remarks
 * - baseURL - `https://pass.wafer.ai/v1`
 * - apiKey - `WAFER_API_KEY`
 */
export const waferAi = createWaferAi(process.env.WAFER_API_KEY ?? '')

/**
 * Weights & Biases Provider
 * @see {@link https://docs.wandb.ai/guides/integrations/inference/}
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
 * Xiaomi Token Plan (Europe) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 * @remarks
 * - baseURL - `https://token-plan-ams.xiaomimimo.com/v1`
 * - apiKey - `XIAOMI_API_KEY`
 */
export const xiaomiTokenPlanAms = createXiaomiTokenPlanAms(process.env.XIAOMI_API_KEY ?? '')

/**
 * Xiaomi Token Plan (China) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 * @remarks
 * - baseURL - `https://token-plan-cn.xiaomimimo.com/v1`
 * - apiKey - `XIAOMI_API_KEY`
 */
export const xiaomiTokenPlanCn = createXiaomiTokenPlanCn(process.env.XIAOMI_API_KEY ?? '')

/**
 * Xiaomi Token Plan (Singapore) Provider
 * @see {@link https://platform.xiaomimimo.com/#/docs}
 * @remarks
 * - baseURL - `https://token-plan-sgp.xiaomimimo.com/v1`
 * - apiKey - `XIAOMI_API_KEY`
 */
export const xiaomiTokenPlanSgp = createXiaomiTokenPlanSgp(process.env.XIAOMI_API_KEY ?? '')

/**
 * Xpersona Provider
 * @see {@link https://www.xpersona.co/docs}
 * @remarks
 * - baseURL - `https://www.xpersona.co/v1`
 * - apiKey - `XPERSONA_API_KEY`
 */
export const xpersona = createXpersona(process.env.XPERSONA_API_KEY ?? '')

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
 * Baidu Qianfan Provider
 * @see {@link https://cloud.baidu.com/doc/qianfan/s/Hmh4suq26}
 * @remarks
 * - baseURL - `https://qianfan.baidubce.com/v2`
 * - apiKey - `QIANFAN_API_KEY`
 */
export const qianfan = createQianfan(process.env.QIANFAN_API_KEY ?? '')

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
