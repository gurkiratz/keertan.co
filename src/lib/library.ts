type Library = {
  tracks: Record<string, Track>
  albums: Record<string, Album>
  playlists: Record<string, Playlist>
  expires: number
  settings: {
    streaming_server: string
  }
}

const user_id = 2222979
const token = 'ab0b0cd4-e0da-11ef-bc7f-b49691aa2236'

export async function getLibrary(): Promise<Library> {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({
    user_id,
    token,
  })

  const response = await fetch('https://library.ibroadcast.com', {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow',
  })

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
