'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { Track, useLibrary } from '@/hooks/use-library'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { loading, library, error } = useLibrary()
  const [results, setResults] = useState<Track[]>([])

  useEffect(() => {
    if (!query || !library) {
      setResults([])
      return
    }

    const searchResults = Object.values(library?.tracks).filter((track) =>
      track.title?.toLowerCase().includes(query.toLowerCase())
    )
    setResults(searchResults)
  }, [query, library])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-500">{error}</div>
      </div>
    )
  }

  if (!query) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Enter a search query
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        No results found for '{query}' in your library
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="grid gap-4">
        {results.map((track) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <div>
              <div className="font-medium">{track.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {library?.albums[track.albumId]?.name || 'Unknown Album'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
