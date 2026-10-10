# xsschema

<!-- automd:file src="/docs/snippets/xsschema.md" -->

```sh
pnpm add xsschema zod
```

```ts
import { toJsonSchema, validate } from 'xsschema'

import * as z from 'zod'

const schema = z.object({ name: z.string() })

console.log(await toJsonSchema(schema))
console.log(await validate(schema, { name: 'Ada' }))
```

<!-- /automd -->

Read the [documentation](https://xsai.js.org/xsschema).
