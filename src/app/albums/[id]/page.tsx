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
    <div className="p-4 md:p-6">
      <Suspense fallback={<Loader />}>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 mb-6 md:mb-8">
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 bg-gray-200 rounded-lg overflow-hidden mx-auto sm:mx-0 shrink-0">
            <Image
              src={album.artwork_url || '/images/unknown-album.png'}
              alt={album.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-end pb-2 sm:pb-4 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 leading-tight">
              {album.name}
            </h1>
            <div className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400">
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
