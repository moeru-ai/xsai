# Create chat messages {#chat}

## Description

Use message helpers to construct chat input.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/utils-chat@0.5.1
```

## Examples

### messages

Use these helpers to create messages.

```ts
const { text } = await generateText({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  messages: [
    { // [!code --]
      content: 'You\'re a helpful assistant.', // [!code --]
      role: 'system' // [!code --]
    }, // [!code --]
    message.system('You\'re a helpful assistant.'), // [!code ++]
    { // [!code --]
      content: 'Why is the sky blue?', // [!code --]
      role: 'user' // [!code --]
    }, // [!code --]
    message.user('Why is the sky blue?'), // [!code ++]
  ],
  model: 'gpt-4o',
})
```

## Result

The helper returns message values for the text operations.
