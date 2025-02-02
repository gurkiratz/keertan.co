'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLibrary } from '@/hooks/use-library'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''
  const { library } = useLibrary()
  const tracks = useMemo(() => library?.tracks || [], [library?.tracks])
  const [results, setResults] = useState<any[]>([])

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const searchResults = Array.isArray(tracks)
      ? tracks.filter((track: any) =>
          track.title.toLowerCase().includes(query.toLowerCase())
        )
      : []
    setResults(searchResults)
  }, [query, tracks])

  if (!query) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
        Searching your library
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
        {results.map((track: any) => (
          <div
            key={track.id}
            className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            <div>
              <div className="font-medium">{track.title}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {track.artist}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
