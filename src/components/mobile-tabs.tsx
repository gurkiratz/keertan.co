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
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/85 to-background/80 backdrop-blur-xl border-t border-border/30" />

      {/* Tab content */}
      <div className="relative flex items-center justify-center px-6 py-2 w-full">
        <div className="flex items-center justify-around w-full bg-gradient-to-r from-muted/90 via-card/90 to-muted/90 rounded-full p-1 shadow-lg backdrop-blur-xs border border-border/20">
          {items.map((item) => {
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-2 px-2 rounded-full transition-all duration-200 ease-in-out relative',
                  isActive
                    ? 'bg-gradient-to-b from-card via-card/95 to-muted/90 text-primary shadow-md border border-border/40'
                    : 'text-muted-foreground hover:text-foreground hover:bg-gradient-to-b hover:from-card/60 hover:to-muted/40'
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
