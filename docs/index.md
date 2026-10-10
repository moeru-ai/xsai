---
layout: home
---

<Home>
<template #hero>

```ts
import { responses, streamText } from 'xsai'

const model = responses({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://api.openai.com/v1/',
  model: 'gpt-6-luna',
})

const { stream } = streamText(model, {
  input: 'Write a haiku about small things.',
})

for await (const event of stream)
  console.log(event)
```

</template>
<template #typed>

```ts
import { tool } from '@xsai/text'

import * as z from 'zod'

const weather = tool({
  description: 'Get the current temperature for a city.',
  execute: ({ city, unit }) => `It is 21 degrees ${unit} in ${city}.`,
  //          ^?
  inputSchema: z.object({
    city: z.string(),
    unit: z.enum(['celsius', 'fahrenheit']),
  }),
  name: 'get_weather',
})
```

</template>
</Home>
