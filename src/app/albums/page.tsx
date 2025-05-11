import { getLibrary } from '../actions'
import { Suspense } from 'react'
import { GridView } from '@/components/grid-view'

export default async function AlbumsPage() {
  const library = await getLibrary()

  return (
    <Suspense fallback={<Loader />}>
      <GridView
        title="Albums"
        items={Object.values(library.albums).slice(0, -1)}
        baseUrl="/albums"
      />
    </Suspense>
  )
}

const Loader = () => {
  return (
    <div className="p-6 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
    </div>
  )
}
