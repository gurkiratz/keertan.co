'use client'

import { useLibrary } from '@/hooks/use-library'
import { TracksTable } from '@/components/tracks-table'

export default function TracksPage() {
  const { loading, library, error } = useLibrary()

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tracks</h1>
      <TracksTable
        tracks={Object.values(library.tracks)}
        getAlbumName={(albumId) =>
          library.albums[albumId]?.name || 'Unknown Album'
        }
      />
    </div>
  )
}
