
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getLibrary } from '../actions'
import Link from 'next/link'
import { Suspense } from 'react'

export default async function AlbumsPage() {
  const library = await getLibrary()

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <Suspense fallback={<Loader />}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {Object.values(library.albums).map((album) => (
          <Link href={`/albums/${album.id}`} key={album.id}>
            <Card
              className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <CardHeader>
                <CardTitle>{album.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-2 album-pattern" />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {album.tracks?.length} tracks
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
