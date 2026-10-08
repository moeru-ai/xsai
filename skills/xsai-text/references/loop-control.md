# Control tool loop steps

Use the model from the [text quick start](https://xsai.js.org/text/quick-start).

Use `prepareStep` to change the model or request configuration before a step.
The callback receives `stepNumber`, completed `steps`, and the request `signal`.
It can return request overrides, including `model` and `input`.
`preToolCall(call, { signal })` can return a replacement call, a tool result, or nothing.
A returned tool result skips execution.
`postToolCall(result, { signal })` can return a replacement result or nothing.
Both hooks must preserve `callId`.
A changed ID throws an error.
The loop runs tool calls from one step concurrently.
Missing tools, invalid JSON arguments, validation issues, and execution failures become tool results with `isError: true`.
If the finish reason is `length`, the loop produces error results instead of executing incomplete calls.
Abort reasons still reject the operation.

For stop predicates and defaults, read the [loop reference](https://xsai.js.org/text/api#loop-configuration).
For a complete tool example, read [Call a local tool](https://xsai.js.org/text/tools).
