---
name: xsai-model
description: List the models that a service offers or read one model entry with xsAI.
---

# xsAI models

Read https://xsai.js.org/model.md. Make sure that the API matches the installed xsAI version.

- Use `@xsai/model` or the existing `xsai` package with the project's endpoint configuration.
- Create a catalog with `models({ baseURL, apiKey })`. This factory takes no `model` option.
- Call `listModels(catalog)` or `retrieveModel(catalog, { id })`. These functions query the service for model entries.

For code changes, make sure that the installed types accept the code. Test the affected behavior with existing tests or mock responses.
