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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]"></TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Album</TableHead>
          <TableHead className="text-right">Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tracks.map((track) => (
          <TableRow key={track.id}>
            <TableCell>
              <button
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                onClick={() => setCurrentTrack(track)}
              >
                <Play className="w-4 h-4" />
              </button>
            </TableCell>
            <TableCell>{track.title}</TableCell>
            <TableCell>{getAlbumName(track.albumId)}</TableCell>
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
