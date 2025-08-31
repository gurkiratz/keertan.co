'use client'

import { useState } from 'react'
import { TracksTable } from '@/components/tracks-table'
import { Button } from '@/components/ui/button'
import type { Track, Album } from '@/app/actions'

interface SearchTracksSectionProps {
  tracks: Track[]
  albums: Record<string, Album>
  query: string
}

export function SearchTracksSection({
  tracks,
  albums,
  query,
}: SearchTracksSectionProps) {
  const [displayCount, setDisplayCount] = useState(10)

  const displayedTracks = tracks.slice(0, displayCount)
  const hasMore = tracks.length > displayCount

  const handleSeeMore = () => {
    setDisplayCount((prev) => prev + 10)
  }

  if (tracks.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Tracks</h2>
        <p className="text-muted-foreground">
          No tracks found for &apos;{query}&apos;
        </p>
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold mb-4">
        Tracks ({tracks.length} found)
      </h2>

      <TracksTable tracks={displayedTracks} albums={albums} />

      {hasMore && (
        <div className="mt-4 flex justify-center">
          <Button variant="outline" onClick={handleSeeMore} className="px-6">
            See More ({Math.min(10, tracks.length - displayCount)} more)
          </Button>
        </div>
      )}
    </div>
  )
}
