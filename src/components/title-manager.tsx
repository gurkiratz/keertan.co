'use client'

import { useEffect } from 'react'
import { useTrackStore } from '@/store/track'
import type { Library } from '@/app/actions'

type TitleManagerProps = {
  library: Library
}

export function TitleManager({ library }: TitleManagerProps) {
  const currentTrack = useTrackStore((state) => state.currentTrack)

  useEffect(() => {
    if (currentTrack) {
      const albumName =
        library.albums[currentTrack.albumId]?.name || 'Unknown Album'
      document.title = `${currentTrack.title} - ${albumName} | Keertan`
    } else {
      document.title = 'Keertan'
    }
  }, [currentTrack, library])

  return null
}
