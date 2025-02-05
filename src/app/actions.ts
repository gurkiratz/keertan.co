/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

// import { data as iBroadcastData } from '@/lib/libraryData'

export type Track = {
  id: string
  title: string
  duration: number
  albumId: string
  path: string
}

export type Album = {
  id: string
  name: string
  tracks: string[]
  artistId: string
}

export type Playlist = {
  id: string
  name: string
  tracks: string[]
}

export type Library = {
  tracks: Record<string, Track>
  albums: Record<string, Album>
  playlists: Record<string, Playlist>
  expires: number
  settings: {
    streaming_server: string
  }
}

export async function getLibrary(): Promise<Library> {
  const user_id = process.env.USER_ID
  const token = process.env.TOKEN

  if (!user_id || !token) {
    throw new Error('USER_ID and TOKEN must be set in environment variables')
  }

  const response = await fetch('https://library.ibroadcast.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id,
      token,
    }),
    cache: 'force-cache',
    next: {
      revalidate: 60 * 60 * 24 * 15, // 15 days in seconds
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch library')
  }

  const data = await response.json()

  const tracks: Record<string, Track> = {}
  Object.entries(data.library.tracks).forEach(([id, track]: [string, any]) => {
    tracks[id] = {
      id,
      title: track[2],
      duration: track[4],
      albumId: track[5]?.toString() || '',
      path: track[16],
    }
  })
  
  const albums: Record<string, Album> = {}
  Object.entries(data.library.albums).forEach(([id, album]: [string, any]) => {
    albums[id] = {
      id,
      name: album[0],
      tracks: album[1],
      artistId: album[2]?.toString() || '',
    }
  })
  
  const playlists: Record<string, Playlist> = {}
  Object.entries(data.library.playlists).forEach(
    ([id, playlist]: [string, any]) => {
      playlists[id] = {
        id,
        name: playlist[0],
        tracks: playlist[1],
      }
    }
  )

  return {
    tracks,
    albums,
    playlists,
    expires: data.library.expires,
    settings: data.settings,
  }
}

export async function getStreamUrl(
  track: Track,
  library: Library
): Promise<string> {
  const user_id = process.env.USER_ID
  const token = process.env.TOKEN

  if (!user_id || !token) {
    throw new Error('USER_ID and TOKEN must be set in environment variables')
  }

  return `${library.settings.streaming_server}${track.path}?Expires=${library.expires}&Signature=${token}&user_id=${user_id}&platform=Web&version=1.0.0`
}
