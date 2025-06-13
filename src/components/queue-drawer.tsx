'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { List, Play, X } from 'lucide-react'
import { useTrackStore } from '@/store/track'
import type { Track, Library } from '@/app/actions'
import Image from 'next/image'

type QueueDrawerProps = {
  library: Library
  className?: string
}

export function QueueDrawer({ library, className }: QueueDrawerProps) {
  const [open, setOpen] = useState(false)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const queue = useTrackStore((state) => state.queue)
  const removeFromQueue = useTrackStore((state) => state.removeFromQueue)
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleTrackClick = (track: Track) => {
    setCurrentTrack(track)
    // Remove the track from queue since it's now playing
    removeFromQueue(track.id)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={`w-8 h-8 ${className}`}>
          <List className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Up Next</span>
            <span className="text-sm font-normal text-gray-500">
              {queue.length} track{queue.length !== 1 ? 's' : ''}
            </span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto mt-4">
          {/* Current Track */}
          {currentTrack && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Now Playing
              </h3>
              <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                  {library.albums[currentTrack.albumId]?.artwork_url ? (
                    <Image
                      src={library.albums[currentTrack.albumId].artwork_url!}
                      alt={
                        library.albums[currentTrack.albumId]?.name ||
                        'Album artwork'
                      }
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Art
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate text-green-700 dark:text-green-300">
                    {currentTrack.title}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400 truncate">
                    {library.albums[currentTrack.albumId]?.name ||
                      'Unknown Album'}
                  </div>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  {formatTime(currentTrack.duration)}
                </div>
              </div>
            </div>
          )}

          {/* Queue */}
          {queue.length > 0 ? (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Up Next
              </h3>
              <div className="space-y-2">
                {queue.map((track, index) => {
                  const album = library.albums[track.albumId]
                  return (
                    <div
                      key={track.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 group cursor-pointer"
                      onClick={() => handleTrackClick(track)}
                    >
                      <div className="w-8 text-center text-sm text-gray-400">
                        {index + 1}
                      </div>
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
                        {album?.artwork_url ? (
                          <Image
                            src={album.artwork_url}
                            alt={album?.name || 'Album artwork'}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                            No Art
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">
                          {track.title}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {album?.name || 'Unknown Album'}
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        {formatTime(track.duration)}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
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
            !currentTrack && (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <List className="w-8 h-8 mb-2 opacity-50" />
                <p>No tracks in queue</p>
                <p className="text-sm">Add some tracks to get started</p>
              </div>
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
