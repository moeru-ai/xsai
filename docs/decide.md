# Decisions

`@xsai/decide` asks questions about an input and returns typed answers.
Use it to classify a message, route a ticket, check a policy, or rate a text.
It needs a service with a `decisions` or `systemone` endpoint, or any [language model](/text/adapters).

<!-- @include: ./snippets/decide.md -->

`decide(model, { input, questions })` sends one request that holds every question.
It returns `{ answers, usage }`.
Each key of `questions` is the ID of one question, and the same key holds its answer in `answers`.
The type of an answer follows the `type` of its question, so TypeScript knows which fields exist.

## Question types

A question has `instructions` that tell the model what to judge, and a `type` that sets the shape of the answer.

| Type | Question | Answer |
| --- | --- | --- |
| `boolean` | A yes or no question. | `probability`, a number from 0 to 1 for the answer yes. |
| `choice` | Pick one value from `choices`. | `choice`, the picked value. |
| `score` | Rate the input on the scale in `levels`. | `score`, a number that can have a fraction. |

A score of `1.43` on three levels lies between the second level and the third level.
The first level has the number 0.
The model decides the answer, and you decide what to do with it.
For a boolean answer, compare `probability` with a threshold that suits your use case.

```ts
import type { DecisionModel } from '@xsai/decide'

declare const model: DecisionModel
// ---cut---
import { decide } from '@xsai/decide'

const { answers } = await decide(model, {
  input: 'I was charged twice. Please fix this today.',
  questions: {
    department: {
      choices: [
        { description: 'Payments, invoices, and refunds.', value: 'billing' },
        { description: 'Problems using the product.', value: 'technical' },
      ],
      instructions: 'Which department should handle this message?',
      type: 'choice',
    },
    urgency: {
      instructions: 'How urgent is this message?',
      levels: [{ label: 'Can wait' }, { label: 'Needs a reply today' }, { label: 'Blocks the customer' }],
      type: 'score',
    },
  },
})

console.log(answers.department.choice, answers.urgency.score)
```

`answers.department.choice` has the type `'billing' | 'technical'`.
To keep these literal values, write `choices` inline as shown, or declare them with `as const`.

`input` and `instructions` take a string or an object.
Adapters serialize an object to JSON when the service expects text.

## Use a language model

`toDecisionModel` turns any `LanguageModel` into a decision model.
Use it when your service has no `decisions` endpoint.

```ts
import type { LanguageModel } from '@xsai/text'

declare const languageModel: LanguageModel
// ---cut---
import { decide, toDecisionModel } from '@xsai/decide'

const model = toDecisionModel(languageModel, { temperature: 0 })

const { answers } = await decide(model, {
  input: 'The package arrived with a broken screen.',
  questions: {
    damaged: { instructions: 'Does the customer report a damaged item?', type: 'boolean' },
  },
})
```

The adapter makes one request with [structured output](/text/structured-output) for all questions.
The model writes the numbers itself, so a `boolean` probability is an estimate and not a token probability.
The adapter checks each answer against its question, because some services, such as Ollama, do not enforce the number limits in the schema.
Choice answers and score answers have no `confidence` and no `probabilities`.
Use `decisions()` or `systemone()` when you need those fields.

`toDecisionModel(model, options?)` passes `maxOutputTokens`, `providerOptions`, `reasoningEffort`, `temperature`, and `topP` to the language model.

## Handle a refusal

If the service refuses a question, `decide` throws `DecisionRefusalError` and returns no partial answers.
Its `questionIds` field lists the refused IDs.

```ts
import type { DecisionModel } from '@xsai/decide'

declare const model: DecisionModel
// ---cut---
import { decide, DecisionRefusalError } from '@xsai/decide'

try {
  await decide(model, {
    input: 'A support message.',
    questions: { safe: { instructions: 'Is the message safe to publish?', type: 'boolean' } },
  })
}
catch (error) {
  if (DecisionRefusalError.isInstance(error))
    console.log(error.questionIds)
  else
    throw error
}
```

A model that refuses without naming a question refuses all of them.
`toDecisionModel` does the same when the language model refuses.

## Reference

| Option | Description |
| --- | --- |
| `input` | Required. The content to judge, as a string or an object. |
| `questions` | Required. An object that maps a question ID to a question. |
| `providerOptions` | Options for one adapter. The sections below list them. |
| `signal` | An `AbortSignal`. |

| Question field | Used by | Description |
| --- | --- | --- |
| `type` | All | `boolean`, `choice`, or `score`. |
| `instructions` | All | Required. A string or an object. |
| `choices` | `choice` | Required. A list of `{ value, description? }`. |
| `levels` | `score` | Required. A list of `{ label, description? }`, from the lowest level to the highest. |

| Answer | Fields |
| --- | --- |
| `boolean` | `probability`. |
| `choice` | `choice`, and when the service gives them, `confidence` and `probabilities`, a list of `{ value, probability }`. |
| `score` | `score`, and when the service gives them, `confidence` and `probabilities`, an object that maps a level number to its probability. |

`usage` can have `inputTokens`, `outputTokens`, and `totalTokens`.
A field is absent when the service reports no value.

### Adapters

Every adapter takes `{ baseURL, model, apiKey?, headers?, fetch? }` and returns a `DecisionModel`.

| Adapter | Request | Provider options |
| --- | --- | --- |
| `decisions()` | `POST decisions` | `providerOptions.decisions.overrideInput` |
| `systemone()` | `POST systemone` | `providerOptions.systemone.images` |
| `toDecisionModel(model, options?)` | One request to a `LanguageModel`. | None. The adapter ignores the options of other adapters. |

`systemone()` sends each score level as one string: the `label`, or `label: description` when the level has a description.

`overrideInput` replaces `input` for `decisions()`.
It takes a string, or a list of user messages that can hold `input_text` and `input_image` content.
An empty string also replaces the input.

`images` adds pictures to a `systemone()` request.
Each image is a URL, a data URL, or an object `{ base64, content_type }`.
The content type is `image/jpeg`, `image/png`, or `image/webp`.

### Errors

| Code | Meaning |
| --- | --- |
| `decision-refusal` | The service refused at least one question. `questionIds` lists them. |
| `invalid-response` | `toDecisionModel` got a generation that did not complete, one that has tool calls, or an answer outside its question: a probability outside 0 to 1, a score outside the levels, or a value that is not in `choices`. |
| `truncated-stream` | The text stream of `toDecisionModel` ended without a terminal event. |

HTTP failures throw `HttpError`, and network failures throw `network-error`.
No adapter retries a request.
To write your own decision model, read [Write a custom model](/advanced/custom-models).
