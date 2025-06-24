import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { VoltAgentExporter } from '@voltagent/vercel-ai-exporter'
import { env } from 'node:process'

// Setup VoltAgent exporter
const voltAgentExporter = new VoltAgentExporter({
  baseUrl: 'https://api.voltagent.dev',
  debug: true,
  publicKey: env.VOLTAGENT_PUBLIC_KEY,
  secretKey: env.VOLTAGENT_SECRET_KEY,
})

// Initialize OpenTelemetry SDK
const sdk = new NodeSDK({
  instrumentations: [getNodeAutoInstrumentations()],
  // eslint-disable-next-line ts/no-unsafe-assignment
  traceExporter: voltAgentExporter as any,
})

// eslint-disable-next-line @masknet/no-top-level
sdk.start()
