'use client'
import Image from 'next/image'
import type { Track, Library } from '@/app/actions'

interface NowPlayingProps {
  currentTrack: Track | null
  queue: Track[]
  library: Library
}

export function NowPlaying({ currentTrack, queue, library }: NowPlayingProps) {
  const album = currentTrack ? library.albums[currentTrack.albumId] : null
  const artworkUrl = album?.artwork_url

  return (
    <div className="w-80 bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-4 flex flex-col items-center">
      <div className="w-full flex flex-col items-center">
        <div className="w-56 h-56 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 mb-4 flex items-center justify-center">
          {artworkUrl ? (
            <Image
              src={artworkUrl}
              alt={album?.name || 'Album artwork'}
              width={224}
              height={224}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Artwork
            </div>
          )}
        </div>
        <div className="text-center w-full">
          <h2 className="text-xl font-semibold truncate">
            {currentTrack?.title || 'No track selected'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            {album?.name || 'Unknown Album'}
          </p>
        </div>
      </div>
      <div className="w-full mt-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2 tracking-widest">
          Up Next
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-gray-800">
          {queue.length === 0 && (
            <div className="py-4 text-center text-gray-400 text-sm">
              No upcoming tracks
            </div>
          )}
          {queue.map((track) => {
            const trackAlbum = library.albums[track.albumId]
            const trackArtwork = trackAlbum?.artwork_url
            return (
              <div key={track.id} className="flex items-center gap-3 py-2">
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  {trackArtwork ? (
                    <Image
                      src={trackArtwork}
                      alt={trackAlbum?.name || 'Album artwork'}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      No Art
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{track.title}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {trackAlbum?.name || 'Unknown Album'}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDuration(track.duration)}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}
