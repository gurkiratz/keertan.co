import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLibrary } from '@/app/actions'
import { Suspense } from 'react'
import Link from 'next/link'

export default async function PlaylistsPage() {
  const library = await getLibrary()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Playlists</h1>
      <Suspense fallback={<Loader />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Object.values(library.playlists)
            .slice(0, -1)
            .map((playlist) => (
              <Link key={playlist.id} href={`/playlists/${playlist.id}`}>
                <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <CardHeader>
                    <CardTitle>{playlist.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-2 playlist-pattern" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {playlist.tracks?.length} tracks
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      </Suspense>
    </div>
  )
}

const Loader = () => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  )
}
