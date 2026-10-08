# Generate speech {#speech}

Convert text into audio bytes.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Start a compatible service at the local address shown in the example, or replace that address with your service root.
Make sure that the service accepts the model ID and request protocol shown below.

```sh
npm i @xsai/generate-speech@0.5.1
```

## Examples

```ts
const speech = await generateSpeech({
  baseURL: 'http://localhost:5050',
  input: 'Hello, I am your AI assistant! Just let me know how I can help bring your ideas to life.',
  model: 'tts-1',
  voice: 'en-US-AnaNeural',
})

const audio = Buffer.from(speech)
```

## Result

The example stores the audio bytes in a Node.js Buffer. It does not play the audio.
