---
name: kwaa-typescript-best-practices
description: kwaa's TypeScript best practices. Use when reading or editing .ts or .tsx files.
---

# TypeScript best practices

| Rule | Summary |
|------|---------|
| Modern platforms | Prefer ESM and standard JavaScript and Web APIs. Use the project's runtime targets. Avoid compatibility code for unsupported older runtimes. |
| Strict types | Do not add explicit or implicit `any`. Fix type errors without weakening compiler or lint rules. Use `unknown` for untrusted data. |
| Imports and exports | Separate type-only imports from value imports. Mark type-only exports with `export type`. Prefer named exports. |
| Interfaces and aliases | Prefer `interface` for object contracts and extension points. Use `type` for unions, functions, and derived types. Prefer literal unions over enums. Avoid `enum` and `namespace` in runtime code. |
| Discriminated unions | Keep each state's required fields together. Prefer a `type` discriminant for new event types. Avoid boolean flags combined with unrelated optional fields. |
| Constructive modeling | Choose data structures that exclude invalid combinations. Use tuples for pairs and discriminated unions for variants. Express constraints in the structure before adding runtime checks. |
| Derived types | Derive types from existing schemas and generated types. Use indexed access, `keyof`, `typeof`, and utility types. Use generics to express relationships between types. |
| Simplest sufficient type | Repeated `!`, assertions, or "should never happen" errors can reveal a missing type constraint. Strengthen the input type or allow absence in the return type. |
| Exhaustiveness | Use `never` for impossible states. Add an exhaustive check when the return type and lint rules do not already catch missing cases. |
| `satisfies` and assertions | Prefer annotations or `satisfies` to check values against types. Use `as const` for literal inference. Allow assertions only for a proven condition or a type relationship TypeScript cannot express. Assertions do not validate external data. |
| Boundary validation | Parse external data once at the boundary. Trust the resulting types inside the program. Reuse validators and derive types from existing schemas. Do not define the same shape in a schema, an interface, and a guard. |
| Narrowing | Prefer automatic narrowing with discriminants, `in`, `typeof`, or `instanceof`. Use reusable predicates next and assertions last. Keep single-use checks inline. Guards must check every condition their return type claims. |
| Arrow functions | Prefer `const` arrows and clear expression bodies. Use early returns and guard clauses. If the formatter permits, omit braces around single statements. Use `function` for generators or dynamic `this`. |
| Factories over classes | Prefer functions, composition, and private closure state. Use classes when error identity, platform inheritance, framework integration, or prototype behavior makes the design clearer. |
| Ownership | Keep transformations pure. Local changes to data a function owns are fine. Accept readonly inputs and copy caller data before taking mutable ownership. Neither `readonly` nor object spread isolates nested objects. |
| Collection transforms | Use `map`, `filter`, `flatMap`, and object entry methods for simple transformations. Use `for...of` or `while` for ordered work, early exits, or clearer accumulation. Avoid `for...in`. |
| Object arguments | Prefer options objects for optional behavior, ambiguous arguments, or APIs that need room to grow. A primary argument followed by options is fine. |
| Absence and defaults | Use `??` for defaults. Use `== null` when both `null` and `undefined` mean absence. Preserve valid `false`, `0`, and empty strings. Define whether an `undefined` override preserves the default. |
| Web APIs | Prefer Fetch, URL, Web Streams, and AbortSignal. Keep runtime-specific operations in adapters. Inject operations such as `fetch` when consumers or tests need to replace them. |
| Cancellation | Forward abort signals and preserve their reasons. After cancellation, stop further side effects. Clean up resources on every exit path. |
| Concurrency | Use `Promise.all` when independent operations must all succeed. Use `Promise.allSettled` when partial results are useful. Await ordered effects in a loop. If one operation rejects, `Promise.all` does not cancel the others. |
| Promise ownership | Avoid unnecessary `async`. Keep `return await` when a catch or finally block needs to observe completion. Handle rejected background promises. `void` alone does not handle rejection. |
| Error boundaries | Catch errors only to recover, translate, add context, report, or clean up. Narrow caught `unknown` only as needed. Preserve causes. Rethrow unmatched errors unless the boundary converts all failures. Do not return a success value to hide failure. |
| Small modules | Keep helpers private and define public exports explicitly. Review files at 300 lines. Split at 600 unless keeping related code together is clearer. Exclude generated code and resources. |
| Readability | Extract helpers that name useful behavior. Avoid redundant wrappers. Comments explain why. Use brief TSDoc for public contracts without repeating types. |
| Real tests | Use real platform objects, repeatable test data, and test doubles at external boundaries. Test affected contracts, input mutation, failures, and cancellation. Do not claim that a mocked integration was verified. |

Examples: [references/patterns.md](references/patterns.md).
