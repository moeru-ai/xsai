---
name: xsai-decide
description: Ask typed questions about an input with xsAI, such as classification, routing, policy checks, or rating. Answers are probabilities, choices, or scores.
---

# xsAI decisions

Read https://xsai.js.org/decide.md. Make sure that the API matches the installed xsAI version.

- Use `@xsai/decide` or the existing `xsai` package with the project's endpoint and model configuration.
- Pick the model by endpoint: `decisions()` for a `decisions` endpoint, `systemone()` for a `systemone` endpoint, or `toDecisionModel(languageModel)` to wrap a `LanguageModel` that has neither.
- Call `decide(model, { input, questions })`. Each key of `questions` is a question ID, and the same key holds its answer. Put all questions about one input in one call.
- A `boolean` answer has a `probability`. Compare it with a threshold that the task needs. Do not treat it as a certain yes or no.
- `confidence` and `probabilities` are optional. `toDecisionModel` never returns them, so do not require them in code that must run with any model.
- If a service refuses any question, `decide` throws `DecisionRefusalError` with `questionIds`. Handle it with `DecisionRefusalError.isInstance(error)`.

For code changes, make sure that the installed types accept the code. Test the affected behavior with a custom `DecisionModel` or mock responses.
