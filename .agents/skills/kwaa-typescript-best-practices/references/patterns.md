# TypeScript patterns

## Discriminated unions

Avoid: this type allows a value and an error at the same time.

```ts
export interface ResultEvent<T> {
  error?: Error
  failed: boolean
  value?: T
}
```

Prefer: each variant carries exactly the fields it requires.

```ts
export type ResultEvent<T>
  = | { error: Error, type: 'failure' }
    | { type: 'value', value: T }
```

## Exhaustiveness

If every variant needs a handler, use a `never` assignment to catch missing cases.
Skip the extra check when the return type already catches them.

```ts
type Action = { type: 'reset' } | { type: 'set', value: number }

export const apply = (action: Action, update: (value: number) => void): void => {
  switch (action.type) {
    case 'reset':
      update(0)
      break
    case 'set':
      update(action.value)
      break
    default: {
      const exhaustive: never = action
      void exhaustive
    }
  }
}
```

If you add an action without a handler, the compiler rejects the assignment.
Code that handles only selected actions does not need this check.

## Derived types

Start with an existing type:

```ts
export interface User {
  email: string
  id: string
  name: string
}
```

Avoid: this declaration repeats fields that can become outdated when `User` changes.

```ts
export interface UserSummary {
  id: string
  name: string
}
```

Prefer: derive `UserSummary` from `User`.

```ts
export type UserSummary = Pick<User, 'id' | 'name'>
```

If `User.id` changes to `number`, the derived type updates automatically.
The repeated declaration keeps `string`. Derive types from existing schemas
and generated types in the same way.

## Constructive modeling

If each match needs exactly two participants, a flat array can leave one participant
unmatched. Avoid a plain array for this requirement.

```ts
export type Matches<T> = readonly T[]
```

Prefer: represent each match as a pair.

```ts
export type Matches<T> = readonly (readonly [T, T])[]
```

Each item now contains two participants. Validate untrusted data before converting
it into pairs.

## Simplest sufficient type

If the same assertion or "should never happen" error appears repeatedly, review
the type before adding more checks.

Avoid: this function promises a value but accepts an empty array.

```ts
export const first = <T>(values: readonly T[]): T => values[0]!
```

Prefer: require a first item or return `undefined` when the array is empty.

```ts
export const first = <T>(values: readonly [T, ...T[]]): T => values[0]

export const firstOrUndefined = <T>(values: readonly T[]): T | undefined =>
  values[0]

export const sum = (values: readonly number[]): number =>
  values.reduce((total, value) => total + value, 0)
```

A non-empty tuple guarantees index `0`, not every numeric index. Keep ordinary
arrays for operations such as `sum` that already handle emptiness.

## Boundary validation

Reuse existing validators and derive types from their schemas. For a small,
single-use parser, avoid adding a dependency.

Avoid: this assertion does not check that `location` exists or contains a string.

```ts
export const parseLocation = (text: string): { location: string } =>
  JSON.parse(text) as { location: string }
```

Prefer: check the input and return the fields you validated.

```ts
export const parseLocation = (input: unknown): { location: string } => {
  if (typeof input !== 'object' || input === null
    || !('location' in input) || typeof input.location !== 'string') {
    throw new TypeError('Expected a string location')
  }

  return { location: input.location }
}
```

## Narrowing

Prefer automatic narrowing, then a reusable predicate, and finally an assertion.
Choose the check that matches the input. Use `typeof` for primitives,
`instanceof` for instances, `in` for properties, or a discriminant for union variants.
For unknown input, check the basic type before accessing properties.

Avoid: both variants have `type`, so this predicate accepts images as text.

```ts
type Part = { text: string, type: 'text' } | { type: 'image', url: string }

export const textOf = (part: Part): string | undefined => {
  const isText = (value: Part): value is Extract<Part, { type: 'text' }> =>
    'type' in value
  return isText(part) ? part.text : undefined
}
```

Prefer: use the discriminant to narrow the variant.

```ts
type Part = { text: string, type: 'text' } | { type: 'image', url: string }

export const textOf = (part: Part): string | undefined =>
  part.type === 'text' ? part.text : undefined
```

An inline `filter` predicate can also narrow an existing union. Keep single-use
checks inline.

## `satisfies` and assertions

Use `satisfies` to check that an object matches a type. The compiler checks the
object. No runtime validation occurs.

```ts
interface Options {
  mode: 'fast' | 'safe'
  retries: number
}

export const options = { mode: 'safe', retries: 3 } satisfies Options
```

Keep each assertion close to the check or contract that supports it. Do not use
assertions to skip validation of external data.

## Ownership

Avoid: sorting mutates the caller's array.

```ts
export const sorted = (values: number[]): number[] =>
  values.sort((a, b) => a - b)
```

Prefer: accept readonly input and return a new array.

```ts
export const sorted = (values: readonly number[]): number[] =>
  values.toSorted((a, b) => a - b)
```

A function can change data that it owns. `readonly` prevents writes through that
type. It does not freeze the data or copy shared nested objects.

## Error boundaries

Avoid: this function hides a parsing failure by returning `undefined`.

```ts
export const parseJSON = (text: string): unknown => {
  try {
    return JSON.parse(text)
  }
  catch {
    return undefined
  }
}
```

Prefer: catch the parsing error, add context, and preserve the cause.

```ts
export const parseJSON = (text: string): unknown => {
  try {
    return JSON.parse(text)
  }
  catch (cause) {
    throw new Error('Invalid JSON', { cause })
  }
}
```

The result remains `unknown` until you validate its fields. Keep that validation
outside this catch. Otherwise, a field validation error can be reported as invalid JSON.
