'use client'

import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import type { Track, Album } from '@/app/actions'
import { Play } from 'lucide-react'
import { useTrackStore } from '@/store/track'

interface TracksTableProps {
  tracks: Track[]
  albums: Record<string, Album>
}

export function TracksTable({ tracks, albums }: TracksTableProps) {
  const getAlbumName = (albumId: string) => {
    return albums[albumId]?.name || 'Unknown Album'
  }

  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)
  const setQueue = useTrackStore((state) => state.setQueue)

  const handleTrackClick = (selectedTrack: Track, index: number) => {
    if (currentTrack?.id !== selectedTrack.id) {
      setCurrentTrack(selectedTrack)
      // Add remaining tracks to queue (tracks after the selected one)
      const remainingTracks = tracks.slice(index + 1)
      setQueue(remainingTracks)
    }
  }

  return (
    <Table>
      <TableBody>
        {tracks.map((track, index) => (
          <TableRow
            key={track.id}
            className="border-none cursor-pointer"
            onClick={() => handleTrackClick(track, index)}
          >
            <TableCell>
              <button className="p-2  rounded-full relative">
                {currentTrack?.id === track.id ? (
                  <div className="h-4 flex items-center justify-center gap-[3px]">
                    <div
                      className={`w-[2px] h-3 bg-primary  ${
                        playing ? 'animate-music-bar-1' : ''
                      }`}
                    />
                    <div
                      className={`w-[2px] h-3 bg-primary  ${
                        playing ? 'animate-music-bar-2' : ''
                      }`}
                    />
                    <div
                      className={`w-[2px] h-2.5 bg-primary  ${
                        playing ? 'animate-music-bar-3' : ''
                      }`}
                    />
                  </div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </TableCell>
            <TableCell className="w-full">
              <div className="flex flex-col">
                <span className="font-medium">{track.title}</span>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>{getAlbumName(track.albumId)}</span>
                  <span className="mx-2">•</span>
                  <span>
                    {Math.floor(track.duration / 60)}:
                    {(track.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
