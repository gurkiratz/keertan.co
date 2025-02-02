'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLibrary } from '@/hooks/use-library'
import { useRouter } from 'next/navigation'

export default function AlbumsPage() {
  const { loading, library, error } = useLibrary()
  const router = useRouter()

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
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(library.albums).map((album) => (
          <Card
            key={album.id}
            className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            onClick={() => router.push(`/albums/${album.id}`)}
          >
            <CardHeader>
              <CardTitle>{album.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {album.tracks?.length} tracks
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
