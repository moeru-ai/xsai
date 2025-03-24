import type { StandardSchemaToJsonSchemaFunction, StandardSchemaVendor } from '../types'

const vendorRegistryToJsonSchemaFunctions: Partial<Record<StandardSchemaVendor, StandardSchemaToJsonSchemaFunction | undefined>> = { }

/**
 * Registers a third-party vendor for converting Standard Schemas to JSON schemas.
 *
 * It is idempotent, so feel free to call it multiple times, but it really only
 * has to be called once per vendor.
 */
export const registerStandardSchemaVendor = async (vendor: StandardSchemaVendor): Promise<void> => {
  if (vendorRegistryToJsonSchemaFunctions[vendor])
    return

  switch (vendor) {
    case 'arktype':
      vendorRegistryToJsonSchemaFunctions.arktype = (await import('./arktype')).toJsonSchema
      break
    case 'effect':
      vendorRegistryToJsonSchemaFunctions.effect = (await import('./effect')).toJsonSchema
      break
    case 'valibot':
      vendorRegistryToJsonSchemaFunctions.valibot = (await import('./valibot')).toJsonSchema
      break
    case 'zod':
      vendorRegistryToJsonSchemaFunctions.zod = (await import('./zod')).toJsonSchema
      break
    default:
      throw new Error(`xsschema: Unsupported schema vendor "${vendor as string}"`)
  }
}

/**
 * Registers all installed third-party standard schema vendors.
 *
 * It is idempotent, so feel free to call it multiple times, but it really only
 * has to be called once.
 */
export const registerStandardSchemaVendors = async (): Promise<void> => {
  await Promise.all([
    registerStandardSchemaVendor('arktype').catch(),
    registerStandardSchemaVendor('effect').catch(),
    registerStandardSchemaVendor('valibot').catch(),
    registerStandardSchemaVendor('zod').catch(),
  ])
}

export const getVendorToJsonSchemaFunction = (vendor: StandardSchemaVendor): StandardSchemaToJsonSchemaFunction | undefined => {
  return vendorRegistryToJsonSchemaFunctions[vendor]
}
