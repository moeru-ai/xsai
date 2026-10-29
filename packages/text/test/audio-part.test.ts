import type { AudioPart as PublicAudioPart } from '../../xsai/src'
import type { AssistantMessageContent, AudioPart, ContentMap, DeveloperMessageContent, SystemMessageContent, ToolResultPartContent, UserMessageContent } from '../src'

import { expectTypeOf, it } from 'vitest'

it('exports audio input with base64 data and supported formats', () => {
  expectTypeOf<PublicAudioPart>().toEqualTypeOf<AudioPart>()
  expectTypeOf<ContentMap['audio']>().toEqualTypeOf<AudioPart>()
  expectTypeOf<AudioPart>().toEqualTypeOf<{ data: string, format: 'mp3' | 'wav', type: 'audio' }>()
  expectTypeOf<Extract<UserMessageContent, AudioPart>>().toEqualTypeOf<AudioPart>()
  expectTypeOf<Extract<AssistantMessageContent, AudioPart>>().toBeNever()
  expectTypeOf<Extract<DeveloperMessageContent | SystemMessageContent, AudioPart>>().toBeNever()
  expectTypeOf<Extract<ToolResultPartContent, AudioPart>>().toBeNever()
})
