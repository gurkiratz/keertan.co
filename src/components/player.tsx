'use client'

import { useState, useEffect, useRef } from 'react'
import ReactPlayer from 'react-player'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useLibrary } from '@/hooks/use-library'
import { useTrackStore } from '@/store/track'

export function Player() {
  const [volume, setVolume] = useState(0.8)
  const [progress, setProgress] = useState(0)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)
  const setPlaying = useTrackStore((state) => state.setPlaying)
  const [loading, setLoading] = useState(false)
  const { library, getStreamUrl } = useLibrary()
  const playerRef = useRef<ReactPlayer>(null)

  // Reset player state when track changes
  useEffect(() => {
    if (currentTrack) {
      setLoading(true)
      setProgress(0)
    }
  }, [currentTrack])

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      setPlaying(false)
      setProgress(0)
    }
  }, [])

  const handlePlayPause = () => {
    if (currentTrack) {
      setPlaying(!playing)
    }
  }

  const handleProgress = ({ played }: { played: number }) => {
    setProgress(played * 100)
  }

  const handleSliderChange = (value: number[]) => {
    if (playerRef.current) {
      const time = value[0] / 100
      playerRef.current.seekTo(time)
      setProgress(value[0])
    }
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4 w-1/3">
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-800 rounded">
            {loading && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white" />
              </div>
            )}
          </div>
          <div>
            <h3 className="text-sm font-medium">
              {currentTrack?.title || 'No track selected'}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {currentTrack && library?.albums[currentTrack.albumId]?.name}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center w-1/3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <SkipBack className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10"
              onClick={handlePlayPause}
              disabled={!currentTrack}
            >
              {playing ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <SkipForward className="w-4 h-4" />
            </Button>
          </div>
          <Slider
            className="w-full mt-2"
            value={[progress]}
            max={100}
            step={1}
            onValueChange={handleSliderChange}
          />
        </div>

        <div className="flex items-center gap-2 w-1/3 justify-end">
          <Volume2 className="w-4 h-4" />
          <Slider
            className="w-24"
            value={[volume * 100]}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0] / 100)}
          />
        </div>

        {currentTrack && (
          <ReactPlayer
            ref={playerRef}
            url={getStreamUrl(currentTrack.id)}
            playing={playing}
            volume={volume}
            style={{ display: 'none' }}
            onProgress={handleProgress}
            onReady={() => setLoading(false)}
            onError={() => setLoading(false)}
          />
        )}
      </div>
    </div>
  )
}
