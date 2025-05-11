'use client'

import { Player } from './player'
import type { Library, Track } from '@/app/actions'

type PlayerWrapperProps = {
  library: Library
  getStreamUrl: (track: Track, library: Library) => Promise<string>
}

export function PlayerWrapper({ library, getStreamUrl }: PlayerWrapperProps) {
  return <Player library={library} getStreamUrl={getStreamUrl} />
}
