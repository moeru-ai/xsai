# Create embeddings {#embeddings}

An embedding is a numeric vector that represents input text.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/embed@0.5.1
```

## Examples

### embed

```ts
const { embedding } = await embed({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: 'sunny day at the beach',
  model: 'text-embedding-3-large',
})
```

### embedMany

```ts
const { embeddings } = await embedMany({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: [
    'sunny day at the beach',
    'rainy afternoon in the city',
    'snowy night in the mountains',
  ],
  model: 'text-embedding-3-large'
})
```

## Result

embed returns one vector. embedMany returns vectors for the input strings.
