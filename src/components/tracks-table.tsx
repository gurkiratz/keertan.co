'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Track } from '@/hooks/use-library'
import { Play } from 'lucide-react'
import { useTrackStore } from '@/store/track'

interface TracksTableProps {
  tracks: Track[]
  getAlbumName: (albumId: string) => string
}

export function TracksTable({ tracks, getAlbumName }: TracksTableProps) {
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)
  const currentTrack = useTrackStore((state) => state.currentTrack)
  const playing = useTrackStore((state) => state.playing)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="hidden sm:table-cell">Album</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => (
          <TableRow key={track.id}>
            <TableCell>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full relative"
                onClick={() => setCurrentTrack(track)}
              >
                {currentTrack?.id === track.id ? (
                  <div className="flex items-center gap-[2px]">
                    <div
                      className={`w-[2px] h-3 bg-black dark:bg-white ${
                        playing ? 'animate-music-bar-1' : ''
                      }`}
                    />
                    <div
                      className={`w-[2px] h-3 bg-black dark:bg-white ${
                        playing ? 'animate-music-bar-2' : ''
                      }`}
                    />
                    <div
                      className={`w-[2px] h-2.5 bg-black dark:bg-white ${
                        playing ? 'animate-music-bar-3' : ''
                      }`}
                    />
                  </div>
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            </TableCell>
            <TableCell>{track.title}</TableCell>
            <TableCell className="hidden sm:table-cell">
              {getAlbumName(track.albumId)}
            </TableCell>
            <TableCell className="text-right">
              {Math.floor(track.duration / 60)}:
              {(track.duration % 60).toString().padStart(2, '0')}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
