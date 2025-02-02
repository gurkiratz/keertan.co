import { create } from 'zustand'
import { Track } from '@/hooks/use-library'

type TrackStore = {
  currentTrack: Track | null
  playing: boolean
  setCurrentTrack: (track: Track | null) => void
  setPlaying: (playing: boolean) => void
}

export const useTrackStore = create<TrackStore>((set) => ({
  currentTrack: null,
  playing: false,
  setCurrentTrack: (track) => set({ currentTrack: track, playing: true }),
  setPlaying: (playing) => set({ playing }),
}))
