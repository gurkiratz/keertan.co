import { useMemo } from 'react'
import Fuse from 'fuse.js'
import type { Track, Album, Library } from '@/app/actions'

export type SearchResult = {
  tracks: Track[]
  albums: Album[]
}

export function useSearch(library: Library, query: string): SearchResult {
  const searchResult = useMemo(() => {
    if (!query.trim()) {
      return { tracks: [], albums: [] }
    }

    // Prepare tracks data for search
    const tracksData = Object.values(library.tracks).map((track: Track) => ({
      ...track,
      albumName: library.albums[track.albumId]?.name || '',
    }))

    // Prepare albums data for search
    const albumsData = Object.values(library.albums)

    // Configure Fuse.js for tracks
    const tracksFuse = new Fuse(tracksData, {
      keys: [
        { name: 'title', weight: 0.7 },
        { name: 'albumName', weight: 0.3 }
      ],
      threshold: 0.4, // Allow some fuzziness
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    })

    // Configure Fuse.js for albums
    const albumsFuse = new Fuse(albumsData, {
      keys: [
        { name: 'name', weight: 1.0 }
      ],
      threshold: 0.4,
      includeScore: true,
      includeMatches: true,
      minMatchCharLength: 2,
    })

    // Perform searches
    const trackResults = tracksFuse.search(query)
    const albumResults = albumsFuse.search(query)

    // Extract items from Fuse.js results
    const tracks = trackResults.map(result => {
      const { albumName, ...track } = result.item as Track & { albumName: string }
      return track as Track
    })

    const albums = albumResults.map(result => result.item as Album)

    // Also include albums that contain matching tracks
    const albumsFromTracks = new Set<string>()
    tracks.forEach(track => {
      if (track.albumId && library.albums[track.albumId]) {
        albumsFromTracks.add(track.albumId)
      }
    })

    // Merge album results with albums from track matches
    const allAlbums = new Map<string, Album>()
    
    // Add direct album matches
    albums.forEach(album => {
      allAlbums.set(album.id, album)
    })

    // Add albums from track matches
    albumsFromTracks.forEach(albumId => {
      if (library.albums[albumId]) {
        allAlbums.set(albumId, library.albums[albumId])
      }
    })

    return {
      tracks,
      albums: Array.from(allAlbums.values())
    }
  }, [library, query])

  return searchResult
}