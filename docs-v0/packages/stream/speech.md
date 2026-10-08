# Stream speech {#speech}

Read audio bytes before the speech response ends.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
Install `pcm-player` in the playback application. The original snippet also requires a `toArrayBuffer` helper for its player.

```sh
npm i @xsai/stream-speech@0.5.1
```

## Examples

### Basic

```ts
const { fullStream, usage } = await streamSpeech({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'https://api.openai.com/v1/',
  input: 'The quick brown fox jumped over the lazy dog.',
  model: 'gpt-4o-mini-tts',
  responseFormat: 'pcm',
  voice: 'alloy',
})

const player = new PCMPlayer({
  channels: 1,
  inputCodec: 'Int16',
  sampleRate: 24000,
})

for (const bytes of fullStream)
  player.feed(toArrayBuffer(bytes.buffer))

console.log(await usage)
```

## Result

The example feeds PCM bytes to a player and prints usage after the stream ends.
