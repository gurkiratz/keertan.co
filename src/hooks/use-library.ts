import { useState, useEffect } from 'react'
import { getLibrary } from '@/app/actions'

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

const user_id = process.env.USER_ID
const token = process.env.TOKEN

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

  function getStreamUrl(trackId: string) {
    if (!library) return ''
    const track = library.tracks[trackId]
    if (!track) return ''

    return `${library.settings.streaming_server}${track.path}?Expires=${library.expires}&Signature=${token}&user_id=${user_id}&platform=Postman&version=1.0.0`
  }

  return { loading, library, error, getStreamUrl }
}
