import type { StopCondition as SharedStopCondition, StopContext as SharedStopContext } from '@xsai/shared-chat'

import type { ItemParam } from '../generated'

export type StopCondition = SharedStopCondition<ItemParam>

export type StopContext = SharedStopContext<ItemParam>
