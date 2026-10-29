import type { Fetch, HttpOptions } from '@xsai/shared'

import type { Fetch as PublicFetch } from '../../xsai/src'

import { expectTypeOf, it } from 'vitest'

it('exports the complete-request fetch contract through shared and xsai', () => {
  expectTypeOf<Fetch>().toEqualTypeOf<(request: Request) => Promise<Response>>()
  expectTypeOf<HttpOptions['fetch']>().toEqualTypeOf<Fetch | undefined>()
  expectTypeOf<PublicFetch>().toEqualTypeOf<Fetch>()
})
