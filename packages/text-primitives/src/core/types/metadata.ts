/**
 * Provider extras on a content part. Top-level keys are normalized semantics
 * defined here; provider packages augment this interface with a bucket keyed
 * by package name carrying their wire's verbatim fields
 * (`metadata.messages.signature` and so on). A serializer only reads the
 * normalized keys and its own bucket.
 */
export interface PartMetadata {
  [key: string]: unknown
}
