---
name: xsai-model
description: List the models that a service offers or read one model entry with xsAI.
---

# xsAI models

Read https://xsai.js.org/model.md before you write code. It covers `listModels`, `retrieveModel`, and the entry fields.

Write code in this shape:

1. Install `@xsai/model`.
2. Create a catalog with `models({ baseURL, apiKey })`. This factory takes no `model` option.
3. Call `listModels(catalog)` or `retrieveModel(catalog, { id })`.
4. Take `baseURL` from the user or the project. Ask when it is unknown.

Done when the code type-checks against the installed `@xsai/model`.
