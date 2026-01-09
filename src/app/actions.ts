/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { getServiceAccessToken } from '@/lib/oauth'

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
  artwork_url?: string
  year?: number
  duration?: number
  artwork_id?: string
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
  user_id: string
}

export async function getLibrary(): Promise<Library> {
  const accessToken = await getServiceAccessToken()

  const response = await fetch('https://library.ibroadcast.com/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      // Some APIs expect empty object rather than no body
    }),
    cache: 'force-cache',
    next: {
      revalidate: 60 * 10, // revalidate every 10 minutes
      tags: ['library'], // Add cache tag for targeted revalidation
    },
  })

  const data = await response.json()

  if (!response.ok || data.authenticated === false) {
    if (data.authenticated === false) {
      throw new Error('Authentication failed')
    }
    throw new Error('Failed to fetch library')
  }

  // The response structure might be slightly different or the same
  // Assuming data.library exists as before
  if (!data.library) {
    console.error('Unexpected library response:', data)
    throw new Error('Invalid library data')
  }

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
    // Get the first track of the album to get its artwork_id
    const firstTrackId = album[1]?.[0]

    const firstTrack = firstTrackId ? data.library.tracks[firstTrackId] : null

    const artwork_id = firstTrack ? firstTrack[6]?.toString() : undefined

    albums[id] = {
      id,
      name: album[0],
      tracks: album[1],
      artistId: album[2]?.toString() || '',
      artwork_url: artwork_id
        ? `https://artwork.ibroadcast.com/artwork/${artwork_id}-500`
        : undefined,
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
    user_id: data.user.id,
  }
}

export async function getLibrarySession(): Promise<Library | null> {
  try {
    return await getLibrary()
  } catch (e) {
    console.error('Failed to get library session:', e)
    return null
  }
}

export async function getStreamUrl(
  track: Track,
  library: Library
): Promise<string> {
  const accessToken = await getServiceAccessToken()

  // Documentation: [streaming_server]/[url]?Expires=[now]&Signature=[user token]&file_id=[file ID]&user_id=[user ID]&platform=[your app name]&version=[your app version]
  const timestamp = Date.now() // "Expires=[now]" per docs

  return `${library.settings.streaming_server}${track.path}?Expires=${timestamp}&Signature=${accessToken}&file_id=${track.id}&user_id=${library.user_id}&platform=Keertan&version=1.0.0`
}
