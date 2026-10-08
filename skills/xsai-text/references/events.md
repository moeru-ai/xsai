# Text event reference

A `TextEvent` describes one change in a model response.
For incremental text, follow the [streaming guide](https://xsai.js.org/text/streaming).

| Event | Data |
| --- | --- |
| `step.start` | Starts one model request. |
| `content.start` | Starts a content item with `index` and `contentType`. |
| `text.delta` | Text fragment in `delta`, with `index`. |
| `reasoning.delta` | Reasoning fragment in `delta`, with `index`. |
| `refusal.delta` | Refusal fragment in `delta`, with `index`. |
| `tool-call.delta` | Tool input fragment with `callId`, `delta`, `index`, and optional `name`. |
| `content.end` | Complete Part in `content`, with `index`. |
| `step.end` | Complete assistant message, status, optional usage, and reason or error. |
| `raw` | Provider-specific value in `detail`. |

A terminal event ends one model request.
Each language model request must emit exactly one `step.end`.
A loop can emit several `step.end` events because it runs several requests.

`step.end.status` is `completed`, `incomplete`, `cancelled`, or `failed`.
A failed event carries `error` and has no `reason`.
Other statuses can carry a provider finish reason.
Use `index` to associate deltas with their content item.
Use `content.end` when you need the complete typed value.
