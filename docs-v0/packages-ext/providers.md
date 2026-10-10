# Use provider presets {#providers}

Create request configuration for predefined services.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Set the API key environment variable shown in the example before you run it.
Make sure that the service accepts the model ID and request protocol shown below.

For a library that uses xsAI, use direct request configuration to avoid an added dependency on provider presets.

```sh
npm i @xsai-ext/providers@0.5.1
```

## Usage

### Predefined

> Predefined providers read API keys from `process.env`. Use them in a Node.js environment.

```ts
const { text } = await generateText({
  ...google.chat('gemini-2.5-flash'), // [!code ++]
  apiKey: env.GEMINI_API_KEY!, // [!code --]
  baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/', // [!code --]
  messages: [{
    content: 'Why is the sky blue?',
    role: 'user'
  }],
  model: 'gemini-2.5-flash', // [!code --]
})
```

### Create

For another runtime, import a create function and pass its credentials:

```ts
// import { google } from '@xsai-ext/providers' // [!code --]

const google = createGoogleGenerativeAI('YOUR_API_KEY_HERE') // [!code ++]

const { text } = await generateText({
  ...google.chat('gemini-2.5-flash'),
  messages: [{
    content: 'Why is the sky blue?',
    role: 'user'
  }],
})
```

## Result

The provider functions return configuration for v0 operations.
