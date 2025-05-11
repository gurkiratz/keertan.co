'use client'
import { Library } from '@/app/actions'
import { NowPlaying } from '@/components/now-playing'
import { useTrackStore } from '@/store/track'
// import { usePlayerNowPlaying } from '@/components/player'

function usePlayerNowPlaying(library: Library) {
  const currentTrack = useTrackStore((state) => state.currentTrack)
  // Placeholder: queue is all tracks except the current one, in order
  const allTracks = Object.values(library.tracks)
  const queue = currentTrack
    ? allTracks.filter((t) => t.id !== currentTrack.id).slice(0, 5)
    : allTracks
  return { currentTrack, queue }
}

export function NowPlayingClient({ library }: { library: any }) {
  const { currentTrack, queue } = usePlayerNowPlaying(library)
  return (
    <NowPlaying currentTrack={currentTrack} queue={queue} library={library} />
  )
}
