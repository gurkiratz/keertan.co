'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useTrackStore } from '@/store/track'
import type { Track, Library } from '@/app/actions'

type PlayerProps = {
  library: Library
  getStreamUrl: (track: Track, library: Library) => Promise<string>
}

export function Player({ library, getStreamUrl }: PlayerProps) {
  const [volume, setVolume] = useState(0.8)
  const [progress, setProgress] = useState(0)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)
  const setPlaying = useTrackStore((state) => state.setPlaying)
  const [loading, setLoading] = useState(false)
  const [streamUrl, setStreamUrl] = useState<string | null>(null)
  const playerRef = useRef<ReactPlayer>(null)

  // Reset player state when track changes
  useEffect(() => {
    if (currentTrack) {
      setLoading(true)
      setProgress(0)
      getStreamUrl(currentTrack, library)
        .then((url) => {
          setStreamUrl(url)
          setLoading(false)
        })
        .catch((error) => {
          console.error('Failed to get stream URL:', error)
          setLoading(false)
        })
    } else {
      setStreamUrl(null)
    }
  }, [currentTrack, library, getStreamUrl])

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      setPlaying(false)
      setProgress(0)
    }
  }, [setPlaying])

  const handlePlayPause = useCallback(() => {
    if (currentTrack) {
      setPlaying(!playing)
    }
  }, [currentTrack, playing, setPlaying])

  const handleProgress = useCallback(({ played }: { played: number }) => {
    setProgress(played * 100)
  }, [])

  const handleSliderChange = useCallback((value: number[]) => {
    if (playerRef.current) {
      const time = value[0] / 100
      playerRef.current.seekTo(time)
      setProgress(value[0])
    }
  }, [])

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4">
      <div className="flex items-center justify-between h-full max-w-7xl mx-auto">
        <TrackInfo
          currentTrack={currentTrack}
          library={library}
          loading={loading}
        />
        <Controls
          currentTrack={currentTrack}
          playing={playing}
          progress={progress}
          handlePlayPause={handlePlayPause}
          handleSliderChange={handleSliderChange}
          formatTime={formatTime}
        />
        <VolumeControl volume={volume} setVolume={setVolume} />
        {streamUrl && (
          <ReactPlayer
            ref={playerRef}
            url={streamUrl}
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

type TrackInfoProps = {
  currentTrack: Track | null
  library: Library
  loading: boolean
}

function TrackInfo({ currentTrack, library, loading }: TrackInfoProps) {
  return (
    <div className="items-center gap-4 w-1/3 hidden md:flex">
      <div className="min-w-12 min-h-12 bg-gray-200 dark:bg-gray-800 rounded track-pattern">
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
        <p className="text-xs hidden text-gray-500 dark:text-gray-400">
          {currentTrack && library?.albums[currentTrack.albumId]?.name}
        </p>
      </div>
    </div>
  )
}

type ControlsProps = {
  currentTrack: Track | null
  playing: boolean
  progress: number
  handlePlayPause: () => void
  handleSliderChange: (value: number[]) => void
  formatTime: (seconds: number) => string
}

function Controls({
  currentTrack,
  playing,
  progress,
  handlePlayPause,
  handleSliderChange,
  formatTime,
}: ControlsProps) {
  return (
    <div className="flex flex-col items-center w-full md:w-1/2">
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
      <div className="flex items-center gap-2 w-full">
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
          {currentTrack
            ? formatTime((progress / 100) * currentTrack.duration)
            : '0:00'}
        </span>
        <Slider
          className="flex-1"
          value={[progress]}
          max={100}
          step={1}
          onValueChange={handleSliderChange}
        />
        <span className="text-xs text-gray-500 dark:text-gray-400 min-w-[40px]">
          {currentTrack ? formatTime(currentTrack.duration) : '0:00'}
        </span>
      </div>
    </div>
  )
}

type VolumeControlProps = {
  volume: number
  setVolume: (volume: number) => void
}

function VolumeControl({ volume, setVolume }: VolumeControlProps) {
  return (
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
  )
}
