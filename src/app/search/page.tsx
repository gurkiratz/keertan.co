import { Suspense } from 'react'

import { SearchResultsClient } from '@/components/search-results-client'
import { getLibrary } from '../actions'

type SearchParams = Promise<{ q: string | undefined }>

function NoQuery() {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      Enter a search query
    </div>
  )
}

async function SearchResults({ query }: { query: string }) {
  const library = await getLibrary()

  return <SearchResultsClient library={library} query={query} />
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
