'use server'

import { data as iBroadcastData } from '@/lib/libraryData'
import { revalidatePath } from 'next/cache'

type Track = {
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

const user_id = process.env.USER_ID || ''
const token = process.env.TOKEN || ''

export async function getLibrary(): Promise<Library> {
  // const response = await fetch('https://library.ibroadcast.com/`', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     user_id,
  //     token,
  //   }),
  //   cache: 'force-cache',
  //   next: {
  //     revalidate: 60 * 60 * 24 * 15, // 15 days in seconds
  //   },
  // })

  // console.log('hit api')

  // if (!response.ok) {
  //   throw new Error('Failed to fetch library')
  // }

  // const data = await response.json()

  const data = iBroadcastData

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

export async function refreshLibrary() {
  revalidatePath('/')
  revalidatePath('/tracks')
  revalidatePath('/albums')
  revalidatePath('/playlists')
}
