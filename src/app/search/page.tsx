import { Suspense } from 'react'

import { TracksTable } from '@/components/tracks-table'
import { getLibrary } from '../actions'

type SearchParams = Promise<{ q: string | undefined }>

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      No results found for &apos;{query}&apos; in your library
    </div>
  )
}

function NoQuery() {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      Enter a search query
    </div>
  )
}

async function SearchResults({ query }: { query: string }) {
  const library = await getLibrary()

  const results = Object.values(library.tracks).filter((track) =>
    track.title?.toLowerCase().includes(query.toLowerCase())
  )

  if (results.length === 0) {
    return <NoResults query={query} />
  }

  return <TracksTable tracks={results} albums={library.albums} />
}

export default async function SearchPage(props: {
  searchParams: SearchParams
}) {
  const searchParams = await props.searchParams
  const query = searchParams.q

  if (!query) {
    return <NoQuery />
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for &apos;{query}&apos;
      </h1>
      <Suspense
        fallback={
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
        }
      >
        <SearchResults query={query} />
      </Suspense>
    </div>
  )
}
