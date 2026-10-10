# Models

`@xsai/model` lists the models that a service offers and reads their metadata.
It does not send inference requests.
It needs a service with `GET models`.

<!-- @include: ./snippets/model.md -->

Unlike the other factories, `models()` takes no `model` option.
Use `retrieveModel(catalog, { id })` to read one entry.

An ID in the list does not guarantee that the model works with every xsAI operation.

## Reference

`listModels(catalog, options?)` returns `Promise<ModelCatalogEntry[]>`, in the order of the service.
`retrieveModel(catalog, { id, providerOptions?, signal? })` returns `Promise<ModelCatalogEntry>`.
An entry has a string `id` and optional `providerMetadata`.
The adapter maps `created` and `owned_by` to `providerMetadata.models.created` and `providerMetadata.models.ownedBy`.

`models({ baseURL, apiKey?, headers?, fetch? })` sends `GET models` for a list and `GET models/{id}` for one entry, with the ID URL-encoded.
It adds no pagination, retries, or caching.
HTTP failures throw `HttpError`, and network failures throw `network-error`.

You can also write a `ModelCatalog` yourself.
It has `list(options?)` and `retrieve(options)`, and each can return a value or a promise.
