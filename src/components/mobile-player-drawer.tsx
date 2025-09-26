'use client'

import { useMemo, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
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
  Disc,
  ListMusic,
} from 'lucide-react'
import { useTrackStore } from '@/store/track'
import type { Track, Library } from '@/app/actions'
import Image from 'next/image'
import ReactPlayer from 'react-player'
import Link from 'next/link'

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

  const playlists = useMemo(
    () =>
      Object.values(library.playlists).sort((a, b) =>
        a.name?.localeCompare(b.name)
      ),
    [library.playlists]
  )

  const albums = useMemo(
    () =>
      Object.values(library.albums).sort((a, b) =>
        a.name?.localeCompare(b.name)
      ),
    [library.albums]
  )

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
            <div className="text-sm font-medium truncate">
              {currentTrack.title}
            </div>
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
            {playing ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </Button>
          <ChevronUp className="w-5 h-5 text-muted-foreground" />
        </div>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] p-0">
        <DrawerTitle>{''}</DrawerTitle>

        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/60">
            <Button
              variant="ghost"
              size="icon"
              className="w-8 h-8"
              onClick={() => setOpen(false)}
            >
              <ChevronUp className="w-5 h-5 rotate-180" />
            </Button>
            {/* <div className="text-sm font-medium truncate max-w-[60%]">
              {currentTrack.title}
            </div> */}
            <Button variant="ghost" size="icon" className="w-8 h-8">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex h-full flex-col"
          >
            <div className="px-4 pt-3">
              <TabsList className="grid w-full grid-cols-3 rounded-full bg-muted/70 p-1">
                <TabsTrigger value="player" className="text-xs">
                  Player
                </TabsTrigger>
                <TabsTrigger value="queue" className="text-xs">
                  Queue
                </TabsTrigger>
                <TabsTrigger value="library" className="text-xs">
                  Library
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent
                value="player"
                className="h-full focus:outline-none data-[state=inactive]:hidden"
              >
                <div className="h-full overflow-y-auto px-6 py-4 pb-[calc(env(safe-area-inset-bottom)+88px)]">
                  <div className="flex justify-center mb-6">
                    <div className="w-64 h-64 max-w-full bg-muted rounded-2xl relative overflow-hidden shadow-lg">
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

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-semibold mb-1 truncate">
                      {currentTrack.title}
                    </h2>
                    <p className="text-sm text-muted-foreground truncate">
                      {album?.name || 'Unknown Album'}
                    </p>
                  </div>

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

                  <div className="flex justify-between text-xs text-muted-foreground mb-8">
                    <span>
                      {formatTime((progress / 100) * currentTrack.duration)}
                    </span>
                    <span>{formatTime(currentTrack.duration)}</span>
                  </div>

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

              <TabsContent
                value="queue"
                className="h-full focus:outline-none data-[state=inactive]:hidden"
              >
                <div className="h-full overflow-y-auto px-4 py-4 pb-[calc(env(safe-area-inset-bottom)+88px)]">
                  {currentTrack && (
                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Now Playing
                      </h3>
                      <div className="flex items-center gap-3 p-3 rounded-lg border border-border/40 bg-card/40">
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
                          <div className="font-medium truncate text-sm">
                            {currentTrack.title}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {album?.name || 'Unknown Album'}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(currentTrack.duration)}
                        </div>
                      </div>
                    </div>
                  )}

                  {queue.length > 0 ? (
                    <div>
                      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                        Up Next · {queue.length} track
                        {queue.length !== 1 ? 's' : ''}
                      </h3>
                      <div className="space-y-2">
                        {queue.map((track, index) => {
                          const queueAlbum = library.albums[track.albumId]
                          return (
                            <div
                              key={track.id}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 group cursor-pointer"
                              onClick={() =>
                                handleQueueTrackClick(track, index)
                              }
                            >
                              <div className="w-8 text-center text-xs text-muted-foreground">
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

              <TabsContent
                value="library"
                className="h-full focus:outline-none data-[state=inactive]:hidden"
              >
                <div className="h-full overflow-y-auto px-4 py-4 space-y-8 pb-[calc(env(safe-area-inset-bottom)+96px)]">
                  <section>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Playlists
                    </h3>
                    {playlists.length > 0 ? (
                      <div className="space-y-2">
                        {playlists.slice(0, 6).map((playlist) => (
                          <Link
                            key={playlist.id}
                            href={`/playlists/${playlist.id}`}
                            className="flex items-center gap-3 p-2 rounded-lg border border-border/40 hover:bg-muted/40 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                              <ListMusic className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate text-sm">
                                {playlist.name}
                              </div>
                              <div className="text-xs text-muted-foreground truncate">
                                {playlist.tracks.length} track
                                {playlist.tracks.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {playlists.length > 6 && (
                          <Link
                            href="/playlists"
                            className="text-xs text-primary hover:underline self-start"
                          >
                            View all playlists
                          </Link>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        No playlists added yet.
                      </p>
                    )}
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Albums
                    </h3>
                    {albums.length > 0 ? (
                      <div className="grid grid-cols-2 gap-3">
                        {albums.slice(0, 8).map((item) => (
                          <Link
                            key={item.id}
                            href={`/albums/${item.id}`}
                            className="flex flex-col gap-2 rounded-lg border border-border/40 p-2 hover:bg-muted/40 transition-colors"
                          >
                            <div className="relative w-full pt-[100%] rounded-md overflow-hidden bg-muted">
                              {item.artwork_url ? (
                                <Image
                                  src={item.artwork_url}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                                  <Disc className="w-5 h-5" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium truncate">
                                {item.name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {item.tracks.length} track
                                {item.tracks.length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        Albums will appear here once available.
                      </p>
                    )}
                  </section>

                  <section>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                      Quick Actions
                    </h3>
                    <div className="space-y-2">
                      <Link
                        href="/"
                        className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
                      >
                        <span>Browse Tracks</span>
                        <ChevronUp className="w-4 h-4 rotate-180 text-muted-foreground" />
                      </Link>
                      <Link
                        href="/albums"
                        className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2 text-sm hover:bg-muted/40 transition-colors"
                      >
                        <span>Browse Albums</span>
                        <ChevronUp className="w-4 h-4 rotate-180 text-muted-foreground" />
                      </Link>
                    </div>
                  </section>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
