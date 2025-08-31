'use client'

import { SearchTracksSection } from '@/components/search-tracks-section'
import { SearchAlbumsSection } from '@/components/search-albums-section'
import { useSearch } from '@/hooks/use-search'
import type { Library } from '@/app/actions'

interface SearchResultsClientProps {
  library: Library
  query: string
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
      No results found for &apos;{query}&apos; in your library
    </div>
  )
}

export function SearchResultsClient({ library, query }: SearchResultsClientProps) {
  const { tracks, albums } = useSearch(library, query)

  const hasResults = tracks.length > 0 || albums.length > 0

  if (!hasResults) {
    return <NoResults query={query} />
  }

  return (
    <div className="space-y-8">
      <SearchAlbumsSection albums={albums} query={query} />
      <SearchTracksSection tracks={tracks} albums={library.albums} query={query} />
    </div>
  )
}