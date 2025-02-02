'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useLibrary } from '@/hooks/use-library'
import { Play } from 'lucide-react'
import { useTrackStore } from '@/store/track'

export default function AlbumPage({ params }: { params: { id: string } }) {
  const { loading, library, error } = useLibrary()
  const setCurrentTrack = useTrackStore((state) => state.setCurrentTrack)

  function playTrack(track: any) {
    setCurrentTrack(track)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!library) return null

  const album = library.albums[params.id]
  if (!album) return null

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{album.name}</h1>
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
          {album.tracks.map((trackId) => {
            const track = library.tracks[trackId]
            if (!track) return null
            return (
              <TableRow key={track.id}>
                <TableCell>
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                    onClick={() => playTrack(track)}
                  >
                    <Play className="w-4 h-4" />
                  </button>
                </TableCell>
                <TableCell>{track.title}</TableCell>
                <TableCell>
                  {library.albums[track.albumId]?.name || 'Unknown Album'}
                </TableCell>
                <TableCell className="text-right">
                  {Math.floor(track.duration / 60)}:
                  {(track.duration % 60).toString().padStart(2, '0')}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
