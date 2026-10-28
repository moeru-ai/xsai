# xsAI 1.0 的 Structured Output 设计研究

研究日期：2026-10-26。本版以高阶函数、单次 schema 配置和 streaming 为推荐方向。代码基线：`7b927345ffd6f60fc43b1677204f9f1e61bfa17a`，workspace 版本 `1.0.0-beta.3`。本文是设计建议，不是已经实现的 API，也不是已接受的 ADR。外部文档和源码按研究当日读取，`main` 链接会变化。

## 建议用高阶函数包装生成入口

推荐让独立的 `@xsai/output` 提供 `withOutput`。它包装现有的 streamText 或 generateText，读取一次 outputFormat，同时完成输出消费。text 不增加 output option、接入协议或结构化结果泛型。

```ts
import { withOutput } from '@xsai/output'
import { streamText } from '@xsai/text'

const events = withOutput(streamText)(model, {
	input: '提取人物信息。',
	outputFormat: Person,
})

for await (const event of events) {
	if (event.type === 'output.partial')
		renderPreview(event.value)
	if (event.type === 'output.done')
		save(event.result.output)
}
```

用户只传一次 Person。没有 Person.partial、json(Person)、单独的 output 实例，也没有请求与消费两处引用。withOutput 的包名和事件名仍是候选，尚未实现为生产 API。

对于多次调用，可以在模块里只包装一次，调用时仍逐次推导 schema：

```ts
const stream = withOutput(streamText)
const events = stream(model, { input, outputFormat: Person })
```

这是对生成函数的组合。原有生成与工具循环仍由传入函数执行，高阶函数负责请求之外的结构化输出消费。本轮临时原型已验证这条调用路径及其类型推导。

## 当前代码已经具备哪些条件

| 现有位置 | 已有行为 | 对设计的影响 |
| --- | --- | --- |
| [`LanguageModelOptions.outputFormat`](../../packages/text/src/types/language-model.ts) | 接受 raw JSON Schema 或 Standard JSON Schema | 请求协议已经存在，无须新建对象生成的 model 类型 |
| [`resolveSchema`](../../packages/text/src/utils/schema.ts) | 使用 `jsonSchema.input({ target: 'draft-07' })`，保留可选 `validate` | 可复用 schema 转换；“能转换”和“能验证”必须区分 |
| 三个 `normalizeFormat` | Chat 映射 `response_format.json_schema`；Responses 映射 `text.format`；Messages 映射 `output_config.format` | wire adapter 继续拥有格式映射 |
| [`streamText`](../../packages/text/src/stream-text.ts) | 同一事件流运行工具循环，默认 `maxSteps(10)`，读流才推进 | 对象生成应复用现有循环和取消行为 |
| [`collect`](../../packages/text/src/collect.ts) | 返回最后一步、所有 steps、总 usage；失败 step 会抛错 | 最终解析应放在完整 collect 之后 |
| [`toStepResult`](../../packages/text/src/utils/step-result.ts) | 只连接最终消息中的 text parts，不混入 reasoning 或 refusal | 可直接以 `result.text` 为 JSON 输入 |
| [`tool()`](../../packages/text/src/tool.ts) | 已有 Standard Schema 验证与 transform 的使用方式 | 新功能沿用同一标准，不绑定 Zod |
| [`toDecisionModel`](../../packages/decide/src/model-text.ts) | 手动检查 refusal、状态、tool calls，再解析并检查数值和枚举 | 仓库已经有真实的结构化输出消费者 |

三个 wire 映射的证据分别见 [Chat](../../packages/text-chat/src/utils/normalize-format.ts)、[Responses](../../packages/text-responses/src/utils/normalize-format.ts)、[Messages](../../packages/text-messages/src/utils/normalize-format.ts)。现有[用户文档](../../docs/text/structured-output.md)也明确要求调用者自己解析和验证。

`xsschema` 目前是单独的兼容工具，能为旧版或仅支持 Standard Schema 的库动态加载 converter。`@xsai/text` 当前没有运行时依赖它。建议维持这个关系，避免把 vendor 检测、动态 import 和 converter 依赖带进普通文本调用。[text package](../../packages/text/package.json)、[xsschema 转换入口](../../packages/xsschema/src/to-json-schema/index.ts)、[vendor 实现](../../packages/xsschema/src/to-json-schema/vendors/index.ts)。

不要以旧笔记中的 API 为实现依据。例如 [AIRI 的旧研究](../airi-xsai-v1/research/text-contract.md)仍有 `streamText` 返回 `{ stream, result }` 的描述，当前源码返回单一 `ReadableStream<TextEvent>`。v0 的 [`generateObject`](../../docs-v0/packages/generate/object.md) 和 [`streamObject`](../../docs-v0/packages/stream/object.md)只作为历史使用场景参考。

## 其他 SDK 值得借鉴什么

下表描述读取到的具体入口，不把某一个入口的行为推广成整个 SDK 的所有模式。

| SDK 与语言 | 官方做法 | 对 xsAI 的判断 |
| --- | --- | --- |
| Vercel AI SDK，TypeScript | `generateText`、`streamText` 接受 `Output.object/array/choice/json`。源码把请求格式、最终解析、partial 解析、元素流组织到 output specification | 借鉴共用生成流程、最终值与预览分开；在独立 output 包实现消费能力 |
| OpenAI Node，TypeScript | `zodResponseFormat`、`zodTextFormat` 把 strict schema 和 parser 绑定；解析入口检查拒答，Chat parser 对 length、content filter 抛错 | 借鉴 schema 与本地 validator 同源、拒答先于解析；不复制 wire 专用 helper 和品牌字段 |
| OpenAI Python | schema 类型转 strict JSON Schema，返回 `parsed`；Pydantic 执行 JSON 验证；Chat parser 明确处理 length 和 content filter | 本地验证必须是返回已验证类型的依据；不要把 `JSON.parse` 当成验证 |
| Anthropic TypeScript | Zod helper 生成转换后的 wire schema，parser 用原始 Zod schema `safeParse`；message parser 保留 text parts 和 `parsed_output` | 与 xsAI 的“adapter 转换、消费端验证”最接近 |
| OpenAI Go | 官方示例从 struct 生成 schema，请求后显式 `json.Unmarshal` 到 struct | 展示了请求和本地解析可以是独立步骤；反序列化也不等于执行所有 JSON Schema 约束 |
| Pydantic AI，Python | 明确区分 Tool Output、Native Output、Prompted Output，并提供输出验证和重试策略 | 三种模式的区分值得保留在设计认识中；xsAI 1.0 默认只扩展现有 native schema 路径 |
| LangChain，Python | `ProviderStrategy`、`ToolStrategy`，可依赖 model profile 自动选择策略，agent state 保存 `structured_response` | 自动降级需要能力信息和 agent 状态。xsAI 的 wire adapter 无法仅凭协议知道远端模型能力 |
| Instructor，Python | schema 验证失败后可以再次请求；文档区分 transport retries 与 validation retries | 适合应用层的显式策略，不应藏在 xsAI 的一次解析操作中 |
| Rig，Rust | 已读取的 `rig 0.44.0` Extractor 用 `JsonSchema + DeserializeOwned`，走 output tool，并管理 extraction retry budget | 借鉴“生成 schema”和“解码成目标类型”是不同能力；synthetic output tool 属于额外编排 |
| Microsoft Agent Framework，.NET | 分开提供 `RunAsync<T>` 和 `ResponseFormat`；流式示例收集完整 response 后反序列化 | 可靠的最终结构化值可以先完成，不必同时实现 partial object |

以上事实的直接来源：

- Vercel：[结构化输出文档](https://ai-sdk.dev/docs/ai-sdk-core/generating-structured-data)、[`output.ts`](https://github.com/vercel/ai/blob/main/packages/ai/src/generate-text/output.ts)。
- OpenAI Node：[`parser.ts`](https://github.com/openai/openai-node/blob/main/src/lib/parser.ts)、[`helpers/zod.ts`](https://github.com/openai/openai-node/blob/main/src/helpers/zod.ts)。当前读取的 raw JSON Schema 分支只解析 JSON，类型是 `unknown`，与绑定 validator 的 helper 分支不同。
- OpenAI Python：[`_completions.py`](https://github.com/openai/openai-python/blob/main/src/openai/lib/_parsing/_completions.py)。
- Anthropic：[`helpers/zod.ts`](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/src/helpers/zod.ts)、[`parser.ts`](https://github.com/anthropics/anthropic-sdk-typescript/blob/main/src/lib/parser.ts)。
- OpenAI Go：[Structured Outputs 官方示例](https://github.com/openai/openai-go/blob/main/examples/structured-outputs/main.go)。
- Pydantic AI：[output modes](https://pydantic.dev/docs/ai/core-concepts/output/#output-modes)。
- LangChain：[structured output](https://docs.langchain.com/oss/python/langchain/structured-output)。
- Instructor：[retrying](https://python.useinstructor.com/concepts/retrying/)。
- Rig：[`Extractor`](https://docs.rs/rig/0.44.0/rig/extractor/struct.Extractor.html)、[`structured_output`](https://docs.rs/rig/0.44.0/rig/structured_output/index.html)。其模块文档还明确说明某个辅助检查只检查顶层 required fields，不检查字段类型，不能把它描述成完整 JSON Schema validator。
- .NET：[Producing structured outputs with agents](https://learn.microsoft.com/en-us/agent-framework/agents/structured-outputs)。

我的取舍是借鉴这些 SDK 的边界和失败处理，而不按功能数量复制它们。xsAI 已有的 `LanguageModel` 是函数，接收完整 options，返回 Web Stream。额外的 provider registry、output tool runner 或多种 SDK 私有 schema wrapper 都会增加当前设计没有要求的状态。

## 服务端 strict 与本地验证是两件事

Structured Output 涉及四个不同判断：

1. 服务是否接受请求 schema。
2. 返回文本是否是合法 JSON。
3. JSON 是否通过原始 schema 的验证。
4. 验证后的值是否满足业务要求。

JSON mode 主要处理第二项。原生 Structured Outputs 在模型支持的 schema 子集内约束生成，但拒答、截断仍需处理。业务事实是否正确也不能由 schema 保证。[OpenAI 官方 Structured Outputs 文档](https://developers.openai.com/api/docs/guides/structured-outputs)。

Google 的官方文档同样说明 JSON Schema 有支持子集，并要求应用验证返回值。Ollama 的 TypeScript 示例在请求后执行 `Country.parse(JSON.parse(...))`。这支持把本地验证设计为 SDK 消费端的一等操作。[Gemini 文档](https://ai.google.dev/gemini-api/docs/structured-output)、[Ollama 文档](https://docs.ollama.com/capabilities/structured-outputs)。本文不建议因此新增 Gemini 或 Ollama 原生 adapter。

### 现有 schema normalization 会改变约束

| 代码中的行为 | 具体后果 | 建议 |
| --- | --- | --- |
| Chat、Responses 把所有 property 放进 `required` | `nickname?: string` 变成必须生成 string，没有表达“未知或缺失” | 明确这不是 optional 的等价转换；优先要求跨 wire schema 显式使用 nullable |
| Chat、Responses 删除 `allOf`、`not`、条件关键字 | 原始 schema 的限制可能丢失 | 有原始 validator 时仍须验证；不能宣称所有 raw schema 被等价支持 |
| 三个 adapter 把 `oneOf` 改成 `anyOf` | 多个分支同时匹配的值可能从不合法变成合法 | 这是放宽约束，应由原始 validator 检查 |
| 三个 adapter 关闭 `additionalProperties` | 动态键对象、record schema 的含义可能改变 | 不能把任意 map 宣称为跨 wire 支持；必要时明确拒绝 |
| Messages 移除数值边界、字符串长度等 | 例如 `score <= 1` 不再由发送的 schema 约束 | 本地验证必须使用原始 schema |
| OpenAI normalizer 遇到 `$ref` 只返回 `$ref` | 同一节点上的约束和 definitions 可能丢失 | 增加根引用与 definitions 的契约测试，不盲目删除 siblings |

证据：[Chat normalizer](../../packages/text-chat/src/utils/normalize-schema.ts)、[Responses normalizer](../../packages/text-responses/src/utils/normalize-schema.ts)、[Messages normalizer](../../packages/text-messages/src/utils/normalize-schema.ts)及它们各自的 [Chat 测试](../../packages/text-chat/test/normalize-schema.test.ts)、[Responses 测试](../../packages/text-responses/test/normalize-schema.test.ts)、[Messages 测试](../../packages/text-messages/test/normalize-schema.test.ts)。

Anthropic 官方 helper 的策略是发送简化 schema，把移除的约束加入 description，并在支持验证的 helper 中使用原始 schema 检查结果。xsAI 可以借鉴补充 description，但 description 只指导模型，不执行验证。[Anthropic schema transformation](https://platform.claude.com/docs/en/build-with-claude/structured-outputs#how-sdk-transformation-works)。

建议区分两类转换。移除不支持的数值边界可以在本地验证补足；丢掉对象结构、切断 `$ref`、把任意 map 关成空对象则可能使请求无法表达原来的任务。这类情况优先明确报错，不能仅靠“之后验证”解释。

这需要单独审核，不能在新增 output 包时顺手重写全部 normalizer。它们也用于 tool schema，修改会同时影响工具调用。[Chat tools](../../packages/text-chat/src/utils/normalize-tools.ts)、[Responses tools](../../packages/text-responses/src/utils/normalize-tools.ts)、[Messages tools](../../packages/text-messages/src/utils/normalize-tools.ts)。

### optional 与 nullable 不等价

OpenAI strict 要求所有字段 required，文档给出的“可选值”表达是与 `null` 的 union。xsAI 当前只是把 optional 字段加入 required，并未增加 null，也未定义 null 到缺失字段的还原。[OpenAI 支持的 schema](https://developers.openai.com/api/docs/guides/structured-outputs#supported-schemas)、[现有 Chat normalizer](../../packages/text-chat/src/utils/normalize-schema.ts)。

建议 1.0 的跨 wire 示例使用 `z.string().nullable()` 表达未知值，不偷偷把 `.optional()` 翻译成 nullable。后者需要双向转换、区分原本就允许的 null，并处理嵌套对象、引用和数组。若将来提供自动转换，应作为明确功能设计。

第一阶段至少在文档公开目前 optional 被强化为 required 的行为。是否改成发送前拒绝 optional，是独立的兼容性决策，尤其不能无意改变所有 tool schema。

## 类型必须由实际执行的 validator 决定

Standard JSON Schema 与 Standard Schema 是两个独立标准。前者提供 JSON Schema 转换与类型信息，后者提供 `validate(unknown)`，成功时返回验证或转换后的 `value`。实现前者不代表实现后者。[Standard JSON Schema FAQ](https://standardschema.dev/json-schema#whats-the-relationship-between-this-and-standard-schema)、[Standard Schema 规范](https://standardschema.dev/)。

现有 `CombinedStandardSchema` 将 `validate` 标为可选，`InferSchemaOutput` 却只检查 `StandardTypedV1`。它适合提取声明的类型，但不足以证明结果已通过验证。新 output 包不应直接把它当作“已验证返回类型”。[schema 类型源码](../../packages/text/src/utils/schema.ts)。

建议采用以下能力边界：

| 输入能力 | 可以发送请求 | 可以执行本地 schema 验证 | 解析入口的返回类型 |
| --- | --- | --- | --- |
| raw `JSONSchema7` | 是 | 默认不可以 | `unknown` |
| 仅 `StandardJSONSchemaV1` | 是 | 不可以 | `unknown` |
| 同时实现两个标准 | 是 | 是 | `StandardSchemaV1.InferOutput<S>` |
| 仅 `StandardSchemaV1` | 无法直接通过现有 `outputFormat` 发送 | 是 | 独立的消费端验证可以返回 `InferOutput<S>` |

不要增加 `jsonSchema<T>(rawSchema)` 就声称拿到已验证的 T。若应用只给 raw schema，仍可得到 JSON 值，但文档必须写明未执行 schema 验证。需要更强保证时，由应用提供 Standard Schema validator；1.0 无须内置 Ajv 或自己实现 JSON Schema evaluator。

### 发送 input schema，返回 validator 的 output

例如 schema 接受 `{ count: '42' }`，transform 后返回 `{ count: 42 }`。wire 应收到 string schema，本地调用者应收到 number。直接给模型发送 output schema 会让 validator 的输入契约失配。当前 `resolveSchema` 已使用 `jsonSchema.input`，应保留。[现有实现](../../packages/text/src/utils/schema.ts)、[标准对 input 和 output 的解释](https://standardschema.dev/json-schema#why-both-jsonschemainput-and-jsonschemaoutput)。

因此解析过程应为 `JSON.parse` 得到 `unknown`，交给原始 validator，返回 `validation.value`。不要验证后仍返回原来的 JSON 值。异步 validator 需要 `await`，验证异常不能伪装成成功。

对于不支持 JSON Schema input 导出的 transform，转换失败就是输入错误。不要回退到 output schema 或悄悄丢弃 transform。

仅支持旧版 Standard Schema 的库需要兼容层，把 JSON Schema converter 与原始 validator 组合成同时支持两个标准的对象。高阶函数接收该对象，避免让用户在生成和解析位置各传一份配置。消费端解析不应为了验证重新导出一遍 JSON Schema。[xsschema](../../packages/xsschema/src/to-json-schema/index.ts)。

## 高阶函数包装哪一层

建议包装完整的 streamText 或 generateText。它们已经拥有工具循环和最终结果边界，高阶函数可以同时拿到调用 options 与返回值。

只包装 model 无法直接掌握整个工具循环何时结束，因为 model 只代表一步请求。只包装结果流则看不到请求 schema，容易再次要求用户传两遍配置。包装生成函数可以避开这两种问题。[LanguageModel](../../packages/text/src/types/language-model.ts)、[streamText](../../packages/text/src/stream-text.ts)。

| 位置 | 推荐职责 |
| --- | --- |
| `@xsai/text` | 原有函数、options、TextEvent、工具循环与 collect，不增加扩展机制 |
| `@xsai/output` | withOutput、partial parser、预览形状处理、最终验证、output 事件和错误 |
| 三个 wire adapter | 原有 schema normalization 与请求格式映射 |
| 应用 | 包装入口，传一次 schema，消费事件或等待结果 |

Vercel 废弃对象专用入口的原因包含工具调用能力差异。这里保留相同生成入口及其完整循环，同时把附加能力放到外部组合层。[迁移指南](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0#generateobject-and-streamobject-deprecation)、[原始 PR](https://github.com/vercel/ai/pull/10754)。

与上一版的小型 output 协议相比，这次连协议维护也留在 output 包。text 无需认识 withOutput。

## streaming 与一次性结果共享使用方式

```ts
import { withOutput } from '@xsai/output'
import { generateText, streamText } from '@xsai/text'

const generate = withOutput(generateText)
const result = await generate(model, { input, outputFormat: Person })
console.log(result.output.name, result.totalUsage)

const stream = withOutput(streamText)
for await (const event of stream(model, { input, outputFormat: Person })) {
	if (event.type === 'output.partial')
		renderPreview(event.value)
	if (event.type === 'output.reset')
		clearPreview()
	if (event.type === 'tool-call.delta')
		showToolProgress(event)
	if (event.type === 'output.done')
		save(event.result.output)
}
```

这是两种调用方式的对照，不代表一个业务请求应该先 generate 再 stream。也不需要恢复独立的 generateObject 或 streamObject。

包装后的 stream 保持单个 ReadableStream，透传工具、reasoning 与 raw 事件，在源流结束后产生 output.done。普通 text 调用的返回值和类型不变。

如果要经过异步事件 handler 再等待最终结果，可在 output 包提供 collectOutput。原有 collect 不会保存它不认识的 output.done，不能声称把带新事件的流交给原 collect 就自动得到 output 字段。

## 高阶函数内部怎样实现

包装函数读取本次 options.outputFormat，创建本次运行的私有输出消费者，然后调用传入的生成函数一次：

- 若返回 ReadableStream，返回经过输出消费处理的惰性流。
- 若返回 Promise<CollectResult>，等待原结果，然后解析其最终 text，返回原结果加 output。

先支持 xsAI 这两种明确签名，不尝试做适配任意 SDK 的通用函数装饰器。TypeScript overload 可以分别保持 streaming 和 Promise 的返回形式，并在每次调用时从 outputFormat 推导完整输出类型。

传给原生成函数的仍然是普通 StreamTextOptions。没有新增 output 属性，没有 JSON descriptor，adapter 继续读取原始 schema。最终验证的原始 schema 由包装函数捕获，不要求用户另传一次。

包装动作不执行请求，也不捕获某一次调用的 reader 或 JSON 文本。同一个包装函数应能并发运行，并接受不同 schema。parser 状态必须在实际调用内创建，避免上次请求影响下次。

这个边界的维护成本是两种函数签名与 output 包内的推导，成本没有转移给 text。已有的普通 wrapper 和 prepareStep 是否能原样组合，应通过类型测试和工具循环测试验证，不承诺适配任意重载函数。

代码层可以复用此前验证过的输出消费者：保留 step.end 和本地 tool-result 摘要事件，源流关闭后交给现有 collect 计算 steps 与 usage。不要缓存全部 deltas 来重新播放，也不重新请求模型或执行工具。[collect](../../packages/text/src/collect.ts)。

## 包装函数也有明确的代价

用户多一次 withOutput 包装，但可以在模块中配置一次。它替代了每次调用都重复写 partial schema、描述对象和管道连接的成本。

output 包需要维护生成函数的输入输出类型。若未来 text 改变公共签名，应同步更新包装层。采用已公开的函数和类型，不依赖私有 generator，不要求 text 为它预留 hook。

包装的是整次生成，因此对先调用工具、最后才输出 JSON 的流程有完整的消费边界。prepareStep 若覆盖 outputFormat，最终成功仍需通过最初捕获的 schema 验证，不能假装包装层能保证每一步请求的配置都没有变化。

这条方案满足当前的约束：schema 一次、streaming 是主要用法、生成循环复用、text 无新增协议。它没有自动解决通用 typed partial 和 JSON parser 的全部问题，后文保留这些独立要求。

## partial 不再要求用户提供第二份 schema

默认预览由库处理输入侧的 JSON。完整原始 schema 的 validator 只在最终值阶段执行。不要对每个前缀运行完整 transform 或业务 refinement，也不在内部调用不存在于标准接口的 schema.partial。[Standard Schema 与 Standard JSON Schema 的区别](https://standardschema.dev/json-schema)。

需要分开理解两项工作：

- partial JSON parser 从文本前缀产生可显示的 JSON 快照。
- 预览的类型和形状处理决定 UI 可以如何读取该快照。

第一项不需要用户写 Person.partial。第二项也应当由库尽可能基于导出的 input JSON Schema 处理，不能把它重新变成默认调用的第二份 schema 参数。

预览不等于最终的 T。对于 string-to-number transform，wire 中的 string 预览不应被标成 number。`DeepPartial<InferOutput<S>>` 因此不可直接使用。[input 与 output schema](https://standardschema.dev/json-schema#why-both-jsonschemainput-and-jsonschemaoutput)。

若提供有类型的 draft，需要基于 input 的 JSON 形状，并对实际快照执行对应的结构检查。partial 字符串还可能不匹配最终 enum，不能直接沿用最终字面量类型。refinement、brand 和复杂引用也不能靠类型断言补足。

建议 draft 描述“可显示的 JSON 形状”，保留字段与嵌套关系，放宽尚未完成的字段和值约束。不能安全推导的 schema 分支使用 JSON 值类型。这部分需要单独原型验证，当前不声称已经完成通用实现。

因此用户默认只传 Person。库对预览的可信程度负责给出准确类型和文档；用户无需为内部解析能力补配置。只有需要自定义展示转换的高级场景，才考虑额外可选配置。

## streaming 的完成与失败规则不变

| 事件 | 意义 |
| --- | --- |
| `output.partial` | 带 stepNumber 的候选预览，未通过最终 validator |
| `output.reset` | 当前步骤转入工具调用或继续生成，撤回候选预览 |
| `output.done` | 源流正常关闭后产生的唯一最终成功，包含原 CollectResult 和验证后的 output |

只在 JSON 前缀可解析时不能提交结果。step.end 也不等于整个工具循环完成。当前 collect 会等待 step.end 之后源流关闭，输出消费端必须保持这一规则。[collect 测试](../../packages/text/test/collect.test.ts)。

每个 step 重置预览文本，按 part index 汇集 text，排除 reasoning、refusal 和 tool arguments。最后以终态 message 的 text 为准，兼容只有 step.end 而没有 deltas 的模型实现。[toStepResult](../../packages/text/src/utils/step-result.ts)。

完整结果仍检查 refusal reason 和 refusal part、completed 状态、未解决的 tool calls、pause_turn。最后严格 JSON.parse，并使用原始 validator 返回的 value。provider failure、截断、HTTP 错误和 abort reason 保持原样，不全部包装成 JSON 错误。

用户暂停消费时不后台 drain，取消时立即取消 pending read 并转发原因。描述对象可复用，每次 stream 创建独立状态，不保存共享 reader 或当前 JSON。

prepareStep 保持原有能力。如果应用在后续步骤换掉 outputFormat，最终成功仍然必须通过最初选择的 output 的 validator。不要在 text 增加一个猜测“哪个步骤是最后一步”的 planner。[prepareStep](../../packages/text/src/types/prepare-step.ts)。

## 保留小核心，不等于隐藏解析成本

Vercel 的 partial 处理会尝试修复不完整 JSON，LangChain 的累计 parser 负责 partial 解析与去重。这些都属于独立 output 实现，而不是 text 的职责。[Vercel partial parser](https://github.com/vercel/ai/blob/main/packages/ai/src/util/parse-partial-json.ts)、[LangChain parser](https://github.com/langchain-ai/langchainjs/blob/b261746b6355bcb0656e0c4bdfe2b983486781e9/libs/langchain-core/src/output_parsers/transform.ts)。

每次 delta 都重新解析整个前缀会有累计 CPU 和分配成本。去重并不能消除重新解析。需要测试长字符串、大数组、极小 deltas，并评估减少解析频率或真正的增量 parser。[streamparser 项目](https://github.com/juanjoDiaz/streamparser-json/blob/main/packages/plainjs/README.md)。

同样，json 预览不等于已验证的 element stream。若提供 array 工厂，可以由独立 output 包负责 object envelope、引用路径和元素边界，仍以一个 output 参数传给文本入口，不增加 generateObject 或用户手动的管道连接。

OpenAI 的 root object 限制、递归 $ref、元素 validator 与整个数组约束仍需分别处理。不能从不透明的 Standard Schema array 凭空提取元素 validator。[OpenAI schema 限制](https://developers.openai.com/api/docs/guides/structured-outputs#supported-schemas)。

## 实施条件

先验证高阶函数的完整单配置调用：streaming、await-only、工具进度、部分预览和最终验证。不要只发布 parse，然后让用户补齐 streaming。

同时设定 text 的边界：不增加 parser 的运行时 import，不增加第二套工具循环，不提供输出模式 registry，不把 JSON 类型策略传播到 LanguageModel，不创建多个 replay 分支。

类型与行为测试需要覆盖未包装路径的原类型、包装路径的最终 transform 类型、draft 的输入形状，以及同一个包装函数对不同 schema 的逐次推导。

保留已有关于拒答、截断、源流收尾错误、取消、多 step、多 part、无 deltas、工具次数和 usage 的验证。自动 draft 的类型、安全性、parser 性能与生产 bundle 体积仍是正式实现前的必要验证，不能用临时探针通过替代。

## 已完成的代码验证与研究限制

本轮在 `/tmp/xsai-output-hof-probe.mts` 验证 withOutput 包装当前 streamText 和 generateText 的方式。运行与严格 TypeScript 检查通过，未修改任何生产源码：

- options 中只提供一次 outputFormat: Person，没有第二份 schema。
- stream 返回 ReadableStream，generate 返回 Promise，完整输出 count 的 transform 推导为 number。
- 同一个包装函数在另一次调用中使用 City schema，最终 city 推导为 string。
- streaming 保留先工具、后 JSON 的现有循环，模型调用两次、工具执行一次。
- 包装和创建流时不开始模型请求。
- text 的 options、协议和源码均不需要修改。

原型复用此前的临时消费者，默认预览值使用 unknown。它验证高阶函数接入和最终类型，没有证明通用 typed draft 的自动生成。下面保留底层消费与 schema 行为的验证记录，其中显式 partial schema 不再是推荐的用户接口。

本次另外运行了 collect、stream-text 和 schema 的现有测试，3 个文件、44 项通过：

```sh
pnpm exec vitest run \
	packages/text/test/collect.test.ts \
	packages/text/test/stream-text.test.ts \
	packages/text/test/schema.test.ts
```

还在 `/tmp/xsai-output-stream-probe.mts` 写了独立消费端的临时原型，实际导入当前 text 源码和三个 format normalizer。没有修改任何 package 源码。原型运行与严格 TypeScript 检查通过，确认以下事实：

- 同一描述对象能通过三个 adapter 的现有 format normalization 路径，未做真实网络调用。
- 不读取外层流时模型调用次数为零；取消尚未读取的流也会释放源的 reader lock。
- 现有工具循环调用模型两次、执行工具一次，最终 steps、toolResults、totalUsage 仍由原 collect 计算。
- partial 在最终成功前出现；预览中的 count 是 string，完整 schema transform 后是 number。
- 多个 text parts 可以组成同一个 JSON，reasoning 不进入最终输出。
- step.end 之后源流出错时不发出 output.done，且原始错误保持 identity。
- pending read 期间取消会把同一个 reason 传给上游。
- 普通 pipeThrough 在未消费输出时已经调用一次源的 pull；惰性包装器没有这次调用。

临时原型为验证组合路径借用了 [Vercel fixJson](https://github.com/vercel/ai/blob/main/packages/ai/src/util/fix-json.ts)。它不是已选定的生产 parser，也没有完整实现 raw-schema 分支、数组 element stream、parser 安全测试、所有取消时序或性能测试。不能把这些结果说成完整功能已经验证。

运行原型时使用的检查命令如下，文件仅保存在本次会话的临时目录：

```sh
node --import tsx /tmp/xsai-output-stream-probe.mts
pnpm exec tsc --ignoreConfig --noEmit --strict \
	--target ESNext --module ESNext --moduleResolution Bundler \
	--allowImportingTsExtensions --skipLibCheck --types node \
	--typeRoots /home/kwa/Documents/GitHub/xsai/node_modules/@types \
	/tmp/xsai-output-stream-probe.mts
```

下面保留第一轮对现有 schema 行为的验证。两次测试存在重叠，不把通过数量相加。

已运行以下现有测试，5 个文件、22 项全部通过：

```sh
pnpm exec vitest run \
	packages/text/test/schema.test.ts \
	packages/text-chat/test/normalize-schema.test.ts \
	packages/text-responses/test/normalize-schema.test.ts \
	packages/text-messages/test/normalize-schema.test.ts \
	packages/decide/test/model-text.test.ts
```

另用 Node 26 与仓库安装的 Zod、实际 `resolveSchema` 和 normalizer 运行临时探针，验证了四个事实：optional 字段被强化为 required 且未增加 null；Messages 去掉 score 的上下界而原始 validator 仍拒绝越界值；transform 的 wire input 类型与验证后类型不同；raw 和转换-only schema 都没有 validator。可在仓库根目录重现核心探针：

```sh
node --import tsx --input-type=module <<'JS'
import assert from 'node:assert/strict'
import { createRequire } from 'node:module'
import { resolveSchema } from './packages/text/src/utils/schema.ts'
import { normalizeSchema as chat } from './packages/text-chat/src/utils/normalize-schema.ts'
import { normalizeSchema as messages } from './packages/text-messages/src/utils/normalize-schema.ts'

const require = createRequire(new URL('./packages/text-chat/package.json', import.meta.url))
const z = await import(require.resolve('zod'))
const optional = z.object({ nickname: z.string().optional() })
const source = resolveSchema(optional).schema
assert.deepEqual(source.required ?? [], [])
assert.deepEqual(chat(source).required, ['nickname'])
assert.equal(chat(source).properties.nickname.type, 'string')
assert.equal(optional.safeParse({ nickname: null }).success, false)

const bounded = z.object({ score: z.number().min(0).max(1) })
const sent = messages(resolveSchema(bounded).schema)
assert.equal(sent.properties.score.maximum, undefined)
assert.equal(sent.properties.score.minimum, undefined)
assert.equal(bounded.safeParse({ score: 2 }).success, false)

const transformed = resolveSchema(z.object({ count: z.string().transform(Number) }))
assert.equal(transformed.schema.properties.count.type, 'string')
assert.deepEqual(await transformed.validate({ count: '42' }), { value: { count: 42 } })
assert.equal(resolveSchema({ type: 'object' }).validate, undefined)
assert.equal(resolveSchema({
	'~standard': {
		version: 1,
		vendor: 'probe',
		jsonSchema: { input: () => ({ type: 'object' }), output: () => ({ type: 'object' }) },
	},
}).validate, undefined)
console.log('Structured output probes passed')
JS
```

这些是源码、文档与本地确定性验证。没有调用付费模型，没有验证任意具体模型的实时能力，也没有把现有测试通过描述成服务端兼容性证明。

本建议遵守 [CONTEXT.md](../../CONTEXT.md) 的 wire adapter、LanguageModel、Part、Collect 与 outputFormat 分工。若之后选择让 `generateText` 自动解析或修改 `outputFormat` 的含义，需要同步修改这些公共契约与用户文档。
