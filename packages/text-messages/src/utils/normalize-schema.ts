import type { JSONSchema7, JSONSchema7Definition } from '@xsai/text-primitives/internal'

const SUPPORTED_FORMATS = new Set([
  'date',
  'date-time',
  'duration',
  'email',
  'hostname',
  'ipv4',
  'ipv6',
  'time',
  'uri',
  'uuid',
])

/** Normalize a schema for Anthropic Messages structured outputs. */
export const normalizeSchema = (schema: JSONSchema7): JSONSchema7 => {
  const normalized = { ...schema }
  const normalize = (schema: JSONSchema7Definition): JSONSchema7Definition =>
    typeof schema === 'boolean' ? schema : normalizeSchema(schema)

  if (normalized.type === 'object' || normalized.properties != null) {
    normalized.properties ??= {}
    normalized.properties = Object.fromEntries(Object.entries(normalized.properties).map(([name, property]) => [name, normalize(property)]))
    normalized.additionalProperties = false
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
  if (normalized.allOf != null)
    normalized.allOf = normalized.allOf.map(normalize)
  for (const key of ['exclusiveMaximum', 'exclusiveMinimum', 'maximum', 'minimum', 'multipleOf', 'minLength', 'maxLength', 'maxItems'] as const)
    delete normalized[key]
  if ((normalized.minItems ?? 0) > 1)
    delete normalized.minItems
  if (normalized.format != null && !SUPPORTED_FORMATS.has(normalized.format))
    delete normalized.format

  return normalized
}
