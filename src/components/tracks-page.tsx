import { TracksTable } from '@/components/tracks-table'
import { Suspense } from 'react'
import { getLibrary } from '@/app/actions'

async function TracksContent() {
  const library = await getLibrary()

  return (
    <TracksTable
      tracks={Object.values(library.tracks).slice(0, -1)}
      albums={library.albums}
    />
  )
}

export function TracksPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tracks</h1>
      <Suspense fallback={<Loader />}>
        <TracksContent />
      </Suspense>
    </div>
  )
}

const Loader = () => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground" />
    </div>
  )
}
