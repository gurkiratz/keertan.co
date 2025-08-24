'use client'

import { Disc, ListMusic, Library } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const items = [
  {
    title: 'Tracks',
    url: '/',
    icon: ListMusic,
  },
  {
    title: 'Albums',
    url: '/albums',
    icon: Disc,
  },
  {
    title: 'Playlists',
    url: '/playlists',
    icon: Library,
  },
]

export function MobileTabs() {
  const pathname = usePathname()

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0"
      style={{ zIndex: 60 }}
    >
      {/* Background blur overlay with gradient */}
      <div className="absolute inset-0 bg-linear-to-t from-white/90 via-white/85 to-white/80 dark:from-gray-900/90 dark:via-gray-900/85 dark:to-gray-900/80 backdrop-blur-xl border-t border-gray-200/30 dark:border-gray-700/30" />

      {/* Tab content */}
      <div className="relative flex items-center justify-center px-6 py-2 w-full">
        <div className="flex items-center justify-around w-full bg-linear-to-r from-gray-100/90 via-gray-50/90 to-gray-100/90 dark:from-gray-800/90 dark:via-gray-700/90 dark:to-gray-800/90 rounded-full p-1 shadow-lg backdrop-blur-xs border border-white/20 dark:border-gray-600/20">
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-full transition-all duration-200 ease-in-out relative',
                  isActive
                    ? 'bg-linear-to-b from-white via-white/95 to-gray-50/90 dark:from-gray-700 dark:via-gray-700/95 dark:to-gray-800/90 text-primary shadow-md border border-white/40 dark:border-gray-600/40'
                    : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-linear-to-b hover:from-white/60 hover:to-gray-50/40 dark:hover:from-gray-700/60 dark:hover:to-gray-800/40'
                )}
              >
                <item.icon
                  className={cn(
                    'h-4 w-4 mb-0.5 transition-all duration-200',
                    isActive ? 'text-primary scale-110' : ''
                  )}
                />
                <span className="text-[10px] font-medium leading-tight">
                  {item.title}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
