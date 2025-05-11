import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '@/hooks/use-library'

type TrackStore = {
  currentTrack: Track | null
  playing: boolean
  streamUrl: string | null
  progress: number
  setCurrentTrack: (track: Track | null) => void
  setPlaying: (playing: boolean) => void
  setStreamUrl: (streamUrl: string | null) => void
  setProgress: (progress: number) => void
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      currentTrack: null,
      playing: false,
      streamUrl: null,
      progress: 0,
      setCurrentTrack: (track) => set({ currentTrack: track, playing: true }),
      setPlaying: (playing) => set({ playing }),
      setStreamUrl: (streamUrl) => set({ streamUrl }),
      setProgress: (progress) => set({ progress }),
    }),
    {
      name: 'track-store',
    }
  )
)
