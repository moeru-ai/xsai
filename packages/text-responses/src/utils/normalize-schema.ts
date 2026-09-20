import type { JSONSchema7, JSONSchema7Definition } from '@xsai/text-primitives'

const SUPPORTED_FORMATS = new Set([
  'date',
  'date-time',
  'duration',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'time',
  'uuid',
])

/** Normalize a schema for OpenAI Responses Structured Outputs. */
export const normalizeSchema = (schema: JSONSchema7): JSONSchema7 => {
  const normalized = { ...schema }
  const normalize = (schema: JSONSchema7Definition): JSONSchema7Definition =>
    typeof schema === 'boolean' ? schema : normalizeSchema(schema)

  // OpenAI does not allow keywords next to `$ref`.
  if (normalized.$ref != null)
    return { $ref: normalized.$ref }

  if (normalized.type === 'object' || normalized.properties != null) {
    normalized.properties ??= {}
    normalized.properties = Object.fromEntries(Object.entries(normalized.properties).map(([name, property]) => [name, normalize(property)]))
    normalized.additionalProperties = false
    normalized.required = Object.keys(normalized.properties)
  }
  if (normalized.$defs != null)
    normalized.$defs = Object.fromEntries(Object.entries(normalized.$defs).map(([name, definition]) => [name, normalize(definition)]))
  if (normalized.definitions != null)
    normalized.definitions = Object.fromEntries(Object.entries(normalized.definitions).map(([name, definition]) => [name, normalize(definition)]))
  if (normalized.items != null) {
    normalized.items = Array.isArray(normalized.items)
      ? normalized.items.map(normalize)
      : normalize(normalized.items)
  }
  if (normalized.oneOf != null) {
    const oneOf = normalized.oneOf
    delete normalized.oneOf
    normalized.anyOf = normalized.anyOf == null ? oneOf : normalized.anyOf.concat(oneOf)
  }
  if (normalized.anyOf != null)
    normalized.anyOf = normalized.anyOf.map(normalize)
  // OpenAI Structured Outputs does not support these composition keywords.
  delete normalized.allOf
  delete normalized.not
  delete normalized.if
  delete normalized.then
  delete normalized.else
  if (normalized.format != null && !SUPPORTED_FORMATS.has(normalized.format))
    delete normalized.format

  return normalized
}
