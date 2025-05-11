import { TracksTable } from '@/components/tracks-table'
import { getLibrary } from '@/app/actions'
import { Suspense } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'

export default async function AlbumPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const library = await getLibrary()
  const id = (await params).id

  const album = library.albums[id]
  if (!album) return null

  const tracks = album.tracks
    .map((trackId) => library.tracks[trackId])
    .filter(Boolean)

  // Calculate total duration of the album
  const totalDuration = tracks.reduce((acc, track) => acc + track.duration, 0)

  return (
    <div className="p-6">
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
          <div className="relative w-48 h-48 bg-gray-200 rounded-lg overflow-hidden">
            <Image
              src={album.artwork_url || '/images/unknown-album.jpg'}
              alt={album.name}
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col items-center sm:items-start justify-end pb-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {album.name}
            </h1>
            <div className="text-sm md:text-lg text-gray-600 dark:text-gray-400">
              <p>
                {tracks.length} tracks, {formatDuration(totalDuration)}
              </p>
            </div>
          </div>
        </div>
        <TracksTable tracks={tracks} albums={library.albums} />
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

function formatDuration(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = seconds % 60

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}:${String(remainingSeconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(
    remainingSeconds
  ).padStart(2, '0')}`
}
