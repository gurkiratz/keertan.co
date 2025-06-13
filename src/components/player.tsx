'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import ReactPlayer from 'react-player'
import { Slider } from '@/components/ui/slider'
import { Button } from '@/components/ui/button'
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useTrackStore } from '@/store/track'
import type { Track, Library } from '@/app/actions'
import Image from 'next/image'
import { QueueDrawer } from '@/components/queue-drawer'

type PlayerProps = {
  library: Library
  getStreamUrl: (track: Track, library: Library) => Promise<string>
}

export function Player({ library, getStreamUrl }: PlayerProps) {
  const [volume, setVolume] = useState(0.8)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)
  const setPlaying = useTrackStore((state) => state.setPlaying)
  const streamUrl = useTrackStore((state) => state.streamUrl)
  const setStreamUrl = useTrackStore((state) => state.setStreamUrl)
  const progress = useTrackStore((state) => state.progress)
  const setProgress = useTrackStore((state) => state.setProgress)
  const queue = useTrackStore((state) => state.queue)
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)
  const removeFromQueue = useTrackStore((state) => state.removeFromQueue)
  const moveCurrentToEndOfQueue = useTrackStore(
    (state) => state.moveCurrentToEndOfQueue
  )
  const [loading, setLoading] = useState(false)
  const playerRef = useRef<ReactPlayer>(null)
  const previousTrackIdRef = useRef<string | null>(null)

  // Reset player state when track changes
  useEffect(() => {
    if (currentTrack) {
      const trackChanged = previousTrackIdRef.current !== currentTrack.id
      if (trackChanged) {
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
        previousTrackIdRef.current = currentTrack.id

        // Set media session metadata
        if ('mediaSession' in navigator) {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: currentTrack.title,
            artist:
              library.albums[currentTrack.albumId]?.name || 'Unknown Album',
            album:
              library.albums[currentTrack.albumId]?.name || 'Unknown Album',
            artwork: [
              {
                src: '/images/keertan-icon.png',
                sizes: '512x512',
                type: 'image/png',
              },
            ],
          })
        }
      }
    } else {
      setStreamUrl(null)
      previousTrackIdRef.current = null

      // Clear media session metadata when no track is playing
      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null
      }
    }
  }, [currentTrack, library, getStreamUrl])

  // Only cleanup when component unmounts and no track is playing

  const handlePlayPause = useCallback(() => {
    if (currentTrack) {
      setPlaying(!playing)
    }
  }, [currentTrack, playing, setPlaying])

  const handleProgress = useCallback(
    ({ played }: { played: number }) => {
      setProgress(played * 100)
    },
    [setProgress]
  )

  const handleSliderChange = useCallback(
    (value: number[]) => {
      if (playerRef.current) {
        const time = value[0] / 100
        playerRef.current.seekTo(time)
        setProgress(value[0])
      }
    },
    [setProgress]
  )

  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }, [])

  // Handle next track
  const handleNextTrack = useCallback(() => {
    if (queue.length > 0) {
      const nextTrack = queue[0]
      setCurrentTrack(nextTrack)
      moveCurrentToEndOfQueue()
    } else {
      // No more tracks in queue, stop playing
      setCurrentTrack(null)
      setPlaying(false)
    }
  }, [queue, setCurrentTrack, moveCurrentToEndOfQueue, setPlaying])

  // Handle previous track (for now, just restart current track)
  const handlePreviousTrack = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.seekTo(0)
      setProgress(0)
    }
  }, [setProgress])

  // Handle track end - auto advance to next track
  const handleTrackEnd = useCallback(() => {
    handleNextTrack()
  }, [handleNextTrack])

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return
      }

      switch (e.key) {
        case ' ': // Space
          e.preventDefault() // Prevent page scroll
          if (currentTrack) {
            setPlaying(!playing)
          }
          break
        case 'ArrowLeft': // Left arrow
          if (playerRef.current && currentTrack) {
            const currentTime = playerRef.current.getCurrentTime()
            // If we're near the beginning (< 3 seconds), go to previous track
            if (currentTime < 3) {
              handlePreviousTrack()
            } else {
              // Otherwise, seek back 10 seconds
              playerRef.current.seekTo(Math.max(0, currentTime - 10))
            }
          }
          break
        case 'ArrowRight': // Right arrow
          if (playerRef.current && currentTrack) {
            const currentTime = playerRef.current.getCurrentTime()
            const timeRemaining = currentTrack.duration - currentTime
            // If we're near the end (< 10 seconds), go to next track
            if (timeRemaining < 10) {
              handleNextTrack()
            } else {
              // Otherwise, seek forward 10 seconds
              playerRef.current.seekTo(
                Math.min(currentTrack.duration, currentTime + 10)
              )
            }
          }
          break
        case 'ArrowUp': // Up arrow
          e.preventDefault() // Prevent page scroll
          setVolume((prev) => Math.min(1, prev + 0.1))
          break
        case 'ArrowDown': // Down arrow
          e.preventDefault() // Prevent page scroll
          setVolume((prev) => Math.max(0, prev - 0.1))
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentTrack, playing, setPlaying, handleNextTrack, handlePreviousTrack])

  return (
    <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
      <div className="pb-2 md:pb-2">
        <div className="relative w-full group">
          {/* Mobile-friendly touch area */}
          <div className="md:hidden px-4 py-1 pt-3">
            <Slider
              className="w-full cursor-pointer"
              thumbClassname="block h-5 w-2 shadow-md border-0 bg-primary rounded-md transition-all duration-200 hover:scale-110 active:scale-105"
              trackClassname="rounded-full h-1 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700"
              value={[progress]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>

          {/* Desktop hover-based slider */}
          <div className="hidden md:block">
            <Slider
              className="w-full cursor-pointer"
              thumbClassname="hidden group-hover:block transition-all duration-200"
              trackClassname="rounded-none h-1 group-hover:h-1.5 transition-all duration-200"
              value={[progress]}
              max={100}
              step={1}
              onValueChange={handleSliderChange}
              onMouseMove={(e) => {
                if (currentTrack) {
                  const rect = e.currentTarget.getBoundingClientRect()
                  const pos =
                    ((e.clientX - rect.left) / rect.width) *
                    currentTrack.duration
                  const tooltip = e.currentTarget
                    .nextElementSibling as HTMLDivElement
                  if (tooltip) {
                    tooltip.style.left = `${e.clientX - rect.left}px`
                    tooltip.textContent = formatTime(pos)
                  }
                }
              }}
            />
            <div className="absolute top-[-25px] transform -translate-x-1/2 bg-gray-800 dark:bg-gray-100 text-white dark:text-gray-900 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="flex items-center md:justify-between px-4 pb-4 gap-8">
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
            handleNextTrack={handleNextTrack}
            handlePreviousTrack={handlePreviousTrack}
            formatTime={formatTime}
            library={library}
            queue={queue}
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
              onEnded={handleTrackEnd}
            />
          )}
        </div>
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
  const album = currentTrack ? library.albums[currentTrack.albumId] : null
  const artworkUrl = album?.artwork_url

  return (
    <div className="flex items-center gap-2 md:gap-4 order-1 sm:order-2 flex-1 md:flex-none md:w-1/2">
      <div className="min-w-10 min-h-10 md:min-w-12 md:min-h-12 bg-gray-200 dark:bg-gray-800 rounded track-pattern relative">
        {loading && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900 dark:border-white" />
          </div>
        )}
        {artworkUrl && !loading && (
          <Image
            src={artworkUrl}
            alt={album?.name || 'Album artwork'}
            fill
            sizes="(max-width: 48px) 100vw"
            className="object-cover rounded"
          />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="text-xs md:text-base font-medium w-[140px] sm:w-[90%] md:w-[300px] lg:w-[500px] overflow-hidden whitespace-nowrap group">
          <span className="inline-block group-hover:animate-marquee">
            {currentTrack?.title || 'No track selected'}
          </span>
        </h3>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate w-[140px] sm:w-[200px] md:w-[300px]">
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
  handleNextTrack: () => void
  handlePreviousTrack: () => void
  formatTime: (seconds: number) => string
  library: Library
  queue: Track[]
}

function Controls({
  currentTrack,
  playing,
  progress,
  handlePlayPause,
  handleNextTrack,
  handlePreviousTrack,
  formatTime,
  library,
  queue,
}: ControlsProps) {
  return (
    <div className="flex items-center gap-4 order-2 sm:order-1">
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8 hidden sm:inline-flex"
        onClick={handlePreviousTrack}
        disabled={!currentTrack}
      >
        <SkipBack className="w-4 h-4" />
      </Button>
      <QueueDrawer library={library} className="sm:hidden" />
      <Button
        variant="ghost"
        size="icon"
        className="w-10 h-10"
        onClick={handlePlayPause}
        disabled={!currentTrack}
      >
        {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="w-8 h-8"
        onClick={handleNextTrack}
        disabled={!currentTrack && queue.length === 0}
      >
        <SkipForward className="w-4 h-4" />
      </Button>
      <QueueDrawer library={library} className="hidden sm:inline-flex" />
      <div className="hidden md:flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {currentTrack
            ? formatTime((progress / 100) * currentTrack.duration)
            : '0:00'}
        </span>
        <span>/</span>
        <span>{currentTrack ? formatTime(currentTrack.duration) : '0:00'}</span>
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
    <div className="hidden md:flex items-center justify-self-end sm:ml-auto md:ml-0 gap-2 order-3">
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
