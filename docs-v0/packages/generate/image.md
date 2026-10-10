# Generate an image {#image}

Send a text prompt to an image endpoint.

This page describes the v0 API from `v0.5.1`.
Use v0 package builds with these examples.
Make sure that the service accepts the model ID and request protocol shown below.
The archived example uses HTTP for the public service. Use HTTPS when you send credentials. Model support and count limits can differ.

```sh
npm i @xsai/generate-image@0.5.1
```

## Examples

```ts
const { image } = await generateImage({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'http://api.openai.com/v1/',
  model: 'dall-e-3',
  prompt: 'A cute baby sea otter'
})

const { images } = await generateImage({
  apiKey: env.OPENAI_API_KEY!,
  baseURL: 'http://api.openai.com/v1/',
  model: 'dall-e-3',
  n: 4, // [!code highlight]
  prompt: 'A cute baby sea otter'
})
```

## Result

The result contains one image or an array of images. The provider controls supported models and image counts.
