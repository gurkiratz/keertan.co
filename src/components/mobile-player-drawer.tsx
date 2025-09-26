'use client'

import { useState, useEffect } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  ChevronUp,
  MoreVertical,
  X,
  List,
} from 'lucide-react'
import { useTrackStore } from '@/store/track'
import type { Track, Library } from '@/app/actions'
import Image from 'next/image'
import ReactPlayer from 'react-player'

type MobilePlayerDrawerProps = {
  library: Library
  playerRef: React.RefObject<ReactPlayer>
  volume: number
  setVolume: (volume: number) => void
  handleSliderChange: (value: number[]) => void
  formatTime: (seconds: number) => string
}

export function MobilePlayerDrawer({
  library,
  playerRef,
  volume,
  setVolume,
  handleSliderChange,
  formatTime,
}: MobilePlayerDrawerProps) {
  const [open, setOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('player')
  
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)
  const setPlaying = useTrackStore((state) => state.setPlaying)
  const progress = useTrackStore((state) => state.progress)
  const queue = useTrackStore((state) => state.queue)
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)
  const setQueue = useTrackStore((state) => state.setQueue)
  const removeFromQueue = useTrackStore((state) => state.removeFromQueue)
  const moveCurrentToEndOfQueue = useTrackStore(
    (state) => state.moveCurrentToEndOfQueue
  )

  const handlePlayPause = () => {
    if (currentTrack) {
      setPlaying(!playing)
    }
  }

  const handleNextTrack = () => {
    if (queue.length > 0) {
      const nextTrack = queue[0]
      setCurrentTrack(nextTrack)
      moveCurrentToEndOfQueue()
    } else {
      setCurrentTrack(null)
      setPlaying(false)
    }
  }

  const handlePreviousTrack = () => {
    if (playerRef.current) {
      playerRef.current.seekTo(0)
    }
  }

  const handleQueueTrackClick = (track: Track, index: number) => {
    setCurrentTrack(track)
    const tracksAfter = queue.slice(index + 1)
    const tracksBefore = queue.slice(0, index)
    const newQueue = [...tracksAfter, ...tracksBefore]
    setQueue(newQueue)
  }

  const album = currentTrack ? library.albums[currentTrack.albumId] : null
  const artworkUrl = album?.artwork_url

  if (!currentTrack) return null

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div className="md:hidden flex items-center gap-2 px-4 py-2 cursor-pointer">
          <div className="w-10 h-10 bg-muted rounded relative overflow-hidden">
            {artworkUrl && (
              <Image
                src={artworkUrl}
                alt={album?.name || 'Album artwork'}
                fill
                className="object-cover"
              />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{currentTrack.title}</div>
            <div className="text-xs text-muted-foreground truncate">
              {album?.name || 'Unknown Album'}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="w-10 h-10"
            onClick={(e) => {
              e.stopPropagation()
              handlePlayPause()
            }}
          >
            {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        </div>
      </DrawerTrigger>
      
      <DrawerContent className="h-[85vh] p-0">
        <div className="flex flex-col h-full">
          {/* Header with tabs */}
          <DrawerHeader className="pb-0 pt-2">
            <div className="flex items-center justify-between px-2 mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8"
                onClick={() => setOpen(false)}
              >
                <ChevronUp className="w-5 h-5 rotate-180" />
              </Button>
              <Button variant="ghost" size="icon" className="w-8 h-8">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mx-4 max-w-[200px] self-center">
                <TabsTrigger value="player">Player</TabsTrigger>
                <TabsTrigger value="library">Library</TabsTrigger>
              </TabsList>
              
              <TabsContent value="player" className="flex-1 mt-0">
                <div className="flex flex-col h-full px-6 py-4">
                  {/* Album Art */}
                  <div className="flex justify-center mb-6">
                    <div className="w-64 h-64 bg-muted rounded-2xl relative overflow-hidden shadow-xl">
                      {artworkUrl ? (
                        <Image
                          src={artworkUrl}
                          alt={album?.name || 'Album artwork'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          No Artwork
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Track Info */}
                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-1">{currentTrack.title}</h2>
                    <p className="text-sm text-muted-foreground">
                      {album?.name || 'Unknown Album'}
                    </p>
                  </div>
                  
                  {/* Progress Slider */}
                  <div className="mb-2">
                    <Slider
                      className="w-full"
                      value={[progress]}
                      max={100}
                      step={1}
                      onValueChange={handleSliderChange}
                      thumbClassname="h-4 w-4"
                      trackClassname="h-1"
                    />
                  </div>
                  
                  {/* Time Display */}
                  <div className="flex justify-between text-xs text-muted-foreground mb-8">
                    <span>
                      {formatTime((progress / 100) * currentTrack.duration)}
                    </span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>
                  
                  {/* Playback Controls */}
                  <div className="flex items-center justify-center gap-6 mb-8">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10"
                      onClick={handlePreviousTrack}
                    >
                      <SkipBack className="w-5 h-5" />
                    </Button>
                    <Button
                      variant="default"
                      size="icon"
                      className="w-14 h-14 rounded-full"
                      onClick={handlePlayPause}
                    >
                      {playing ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6 ml-0.5" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-10 h-10"
                      onClick={handleNextTrack}
                      disabled={queue.length === 0}
                    >
                      <SkipForward className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Volume Control */}
                  <div className="flex items-center gap-3 px-4">
                    <Volume2 className="w-4 h-4 text-muted-foreground" />
                    <Slider
                      className="flex-1"
                      value={[volume * 100]}
                      max={100}
                      step={1}
                      onValueChange={(value) => setVolume(value[0] / 100)}
                      thumbClassname="h-3 w-3"
                      trackClassname="h-1"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="library" className="flex-1 mt-0 overflow-y-auto">
                <div className="px-4 py-4">
                  {/* Current Track */}
                  {currentTrack && (
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Now Playing
                      </h3>
                      <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg border border-accent/30">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                          {artworkUrl && (
                            <Image
                              src={artworkUrl}
                              alt={album?.name || 'Album artwork'}
                              fill
                              className="object-cover"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-4 h-4 text-white fill-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{currentTrack.title}</div>
                          <div className="text-sm text-muted-foreground truncate">
                            {album?.name || 'Unknown Album'}
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTime(currentTrack.duration)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Queue */}
                  {queue.length > 0 ? (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Up Next · {queue.length} track{queue.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="space-y-2">
                        {queue.map((track, index) => {
                          const queueAlbum = library.albums[track.albumId]
                          return (
                            <div
                              key={track.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                              onClick={() => handleQueueTrackClick(track, index)}
                            >
                              <div className="w-8 text-center text-sm text-muted-foreground">
                                {index + 1}
                              </div>
                              <div className="relative w-10 h-10 rounded-md overflow-hidden bg-muted shrink-0">
                                {queueAlbum?.artwork_url && (
                                  <Image
                                    src={queueAlbum.artwork_url}
                                    alt={queueAlbum?.name || 'Album artwork'}
                                    fill
                                    className="object-cover"
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate text-sm">
                                  {track.title}
                                </div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {queueAlbum?.name || 'Unknown Album'}
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatTime(track.duration)}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="w-6 h-6 opacity-0 group-hover:opacity-100"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  removeFromQueue(track.id)
                                }}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                      <List className="w-8 h-8 mb-2 opacity-50" />
                      <p>No tracks in queue</p>
                      <p className="text-xs">Add some tracks to get started</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </DrawerHeader>
        </div>
      </DrawerContent>
    </Drawer>
  )
}