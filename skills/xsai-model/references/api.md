# Model catalog API reference

Import these exports from `@xsai/model`.
A model catalog lists models and retrieves their metadata.
It does not run inference requests.

## Operations and contracts

`listModels(catalog, options?)` returns `Promise<ModelCatalogEntry[]>`.
`retrieveModel(catalog, { id, providerOptions?, signal? })` returns `Promise<ModelCatalogEntry>`.
`id` is required for retrieval.

`ModelCatalog.list(options?)` and `ModelCatalog.retrieve(options)` can return a value or a promise.
`ModelCatalogOptions` accepts optional `providerOptions` and `signal`.
The built-in adapter has no provider-specific request fields.

A `ModelCatalogEntry` has a required string `id` and optional `providerMetadata`.
The service controls which IDs it exposes.
An ID in the list does not establish that it supports every xsAI operation.

## Models adapter

`models({ baseURL, apiKey?, headers?, fetch? })` returns a catalog.
Unlike inference factories, it does not accept a `model` field.
It sends `GET models` for listing.
It sends `GET models/{id}` for retrieval and URL-encodes the ID.

The adapter maps `created` and `owned_by` to `providerMetadata.models.created` and `ownedBy`.
It preserves service order in the model list.
The operation does not add pagination, retries, or caching.

`signal` cancels the request.
HTTP failures throw `HttpError`. Network failures use `network-error`.
Malformed JSON or response data can reject the operation.
For shared HTTP configuration, read the [shared reference](https://xsai.js.org/shared/api).
