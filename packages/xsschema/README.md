# xsschema

<!-- automd:file src="/docs/xsschema/quick-start.md" lines="3:" -->

Use Node.js with TypeScript and `tsx`.
A Standard Schema supplies a common validation contract.
This example uses Zod v4. It needs no service or credentials.

```sh
pnpm add xsschema zod@^4
pnpm add -D tsx typescript
```

Save this code as `example.ts`:

```ts
import { toJsonSchema, validate } from 'xsschema'

import * as z from 'zod/v4'

const schema = z.object({ name: z.string() })
console.log(await toJsonSchema(schema))
console.log(await validate(schema, { name: 'Ada' }))
```

Run `pnpm exec tsx example.ts`.
The program prints a JSON Schema and `{ name: 'Ada' }`.
For vendor support and strict schemas, read the [schema API reference](https://xsai.js.org/xsschema/api).

<!-- /automd -->
