import { TracksTable } from '@/components/tracks-table'
import { getLibrary } from '@/app/actions'
import { Suspense } from 'react'

export default async function PlaylistIdPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const library = await getLibrary()
  const id = (await params).id

  const playlist = library.playlists[id]
  if (!playlist) return null

  return (
    <div className="p-6">
      <Suspense fallback={<Loader />}>
        <h1 className="text-2xl font-bold mb-4">{playlist.name}</h1>
        <TracksTable
          tracks={playlist.tracks
            .map((trackId) => library.tracks[trackId])
            .filter(Boolean)}
          albums={library.albums}
        />
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
