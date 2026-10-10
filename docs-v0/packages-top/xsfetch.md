# Retry HTTP requests with xsfetch {#xsfetch}

Create a fetch function with automatic retry behavior.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i xsfetch
```

## Usage

### createFetch

```ts
const fetch = createFetch({
  retry: 3,
  retryDelay: 1000,
})
```

### createFetch with generateText

```ts
const fetch = createFetch({
  retry: 3,
  retryDelay: 1000,
})

const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  fetch, // [!code highlight]
  messages: [
    {
      content: 'You\'re a helpful assistant.',
      role: 'system'
    },
    {
      content: 'Why is the sky blue?',
      role: 'user'
    }
  ],
  model: 'gpt-4o',
})
```

## Result

Pass the created fetch function to a v0 text operation.
