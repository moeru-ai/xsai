# List and retrieve models {#models}

Read the model IDs and metadata that a service exposes.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/model@0.5.1
```

## Examples

### listModels

```ts
// [
//   {
//     "id": "model-id-0",
//     "object": "model",
//     "created": 1686935002,
//     "owned_by": "organization-owner"
//   },
//   {
//     "id": "model-id-1",
//     "object": "model",
//     "created": 1686935002,
//     "owned_by": "organization-owner",
//   },
//   {
//     "id": "model-id-2",
//     "object": "model",
//     "created": 1686935002,
//     "owned_by": "openai"
//   },
// ]
const models = await listModels({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
})
```

### retrieveModel

```ts
// {
//   "id": "gpt-4o",
//   "object": "model",
//   "created": 1686935002,
//   "owned_by": "openai"
// }
const model = await retrieveModel({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-4o',
})
```

## Result

listModels returns the service model list. retrieveModel returns one model entry.
