import type {
  ContentEndEvent as ContentEndEventData,
  ContentStartEvent as ContentStartEventData,
  StepEndEvent as StepEndEventData,
  TextEvent,
} from '@xsai/text-primitives'

export type StreamTextEvent = StreamTextEventMap[keyof StreamTextEventMap]

export interface StreamTextEventMap {
  'content.end': ContentEndEvent
  'content.start': ContentStartEvent
  'step.end': StepEndEvent
  'step.start': StepStartEvent
}

export class ContentEndEvent extends Event {
  readonly content: ContentEndEventData['content']

  readonly index: number
  declare readonly type: 'content.end'

  constructor(event: ContentEndEventData) {
    super('content.end')
    this.content = event.content
    this.index = event.index
  }
}

export class ContentStartEvent extends Event {
  readonly contentType: ContentStartEventData['contentType']

  readonly index: number
  declare readonly type: 'content.start'

  constructor(event: ContentStartEventData) {
    super('content.start')
    this.contentType = event.contentType
    this.index = event.index
  }
}

export class StepEndEvent extends Event {
  readonly error: StepEndEventData['error']

  readonly message: StepEndEventData['message']
  readonly reason: StepEndEventData['reason']
  readonly status: StepEndEventData['status']
  declare readonly type: 'step.end'
  readonly usage: StepEndEventData['usage']

  constructor(event: StepEndEventData) {
    super('step.end')
    this.error = undefined
    this.message = event.message
    this.reason = undefined
    this.status = event.status
    this.usage = undefined

    if (event.status === 'failed')
      this.error = event.error
    else if (event.reason != null)
      this.reason = event.reason

    if (event.usage != null)
      this.usage = event.usage
  }
}

export class StepStartEvent extends Event {
  declare readonly type: 'step.start'

  constructor() {
    super('step.start')
  }
}

export const toStreamTextEvent = (event: TextEvent): StreamTextEvent | undefined => {
  switch (event.type) {
    case 'content.end':
      return new ContentEndEvent(event)
    case 'content.start':
      return new ContentStartEvent(event)
    case 'reasoning.delta':
    case 'refusal.delta':
    case 'text.delta':
    case 'tool-call.delta':
      return undefined
    case 'step.end':
      return new StepEndEvent(event)
    case 'step.start':
      return new StepStartEvent()
  }
}
