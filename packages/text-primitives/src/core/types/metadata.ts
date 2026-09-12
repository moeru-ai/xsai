/**
 * Wire extras on a content part. Top-level keys are normalized semantics
 * defined here; wire adapters augment this interface with a bucket keyed
 * by package name carrying their wire's verbatim fields
 * (`metadata.messages.signature` and so on). A wire adapter only reads the
 * normalized keys and its own bucket.
 */
export interface PartMetadata {
  [key: string]: unknown
}
