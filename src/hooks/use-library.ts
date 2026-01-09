import { useState, useEffect } from 'react'
import { getLibrary, getStreamUrl as getStreamUrlAction } from '@/app/actions'

export type Track = {
  id: string
  title: string
  duration: number
  albumId: string
  path: string
}

type Album = {
  id: string
  name: string
  tracks: string[]
  artistId: string
}

type Playlist = {
  id: string
  name: string
  tracks: string[]
}

type Library = {
  tracks: Record<string, Track>
  albums: Record<string, Album>
  playlists: Record<string, Playlist>
  expires: number
  settings: {
    streaming_server: string
  }
}

export function useLibrary() {
  const [loading, setLoading] = useState(true)
  const [library, setLibrary] = useState<Library | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchLibrary() {
      try {
        const data = await getLibrary()
        setLibrary(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load library')
      } finally {
        setLoading(false)
      }
    }

    fetchLibrary()
  }, [])

  async function getStreamUrl(trackId: string) {
    if (!library) return ''
    const track = library.tracks[trackId]
    if (!track) return ''

    try {
      return await getStreamUrlAction(track, library)
    } catch (e) {
      console.error(e)
      return ''
    }
  }

  return { loading, library, error, getStreamUrl }
}
