import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Track } from '@/hooks/use-library'

type TrackStore = {
  currentTrack: Track | null
  queue: Track[]
  playing: boolean
  streamUrl: string | null
  progress: number
  setCurrentTrack: (track: Track | null) => void
  setPlaying: (playing: boolean) => void
  setStreamUrl: (streamUrl: string | null) => void
  setProgress: (progress: number) => void
  setQueue: (tracks: Track[]) => void
  addToQueue: (track: Track) => void
  removeFromQueue: (trackId: string) => void
  clearQueue: () => void
  moveCurrentToEndOfQueue: () => void
}

export const useTrackStore = create<TrackStore>()(
  persist(
    (set) => ({
      currentTrack: null,
      queue: [],
      playing: false,
      streamUrl: null,
      progress: 0,
      setCurrentTrack: (track) => set({ currentTrack: track, playing: true }),
      setPlaying: (playing) => set({ playing }),
      setStreamUrl: (streamUrl) => set({ streamUrl }),
      setProgress: (progress) => set({ progress }),
      setQueue: (tracks) => set({ queue: tracks }),
      addToQueue: (track) =>
        set((state) => ({ queue: [...state.queue, track] })),
      removeFromQueue: (trackId) =>
        set((state) => ({
          queue: state.queue.filter((t) => t.id !== trackId),
        })),
      clearQueue: () => set({ queue: [] }),
      moveCurrentToEndOfQueue: () =>
        set((state) => {
          if (state.queue.length > 0) {
            const [firstTrack, ...restOfQueue] = state.queue
            return { queue: [...restOfQueue, firstTrack] }
          }
          return state
        }),
    }),
    {
      name: 'track-store',
    }
  )
)
