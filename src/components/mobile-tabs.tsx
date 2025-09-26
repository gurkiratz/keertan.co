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
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[45] bg-background  border-t border-border/60">
      <nav className="mx-auto flex w-full max-w-md items-center justify-around px-6 py-3">
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <Link
              key={item.title}
              href={item.url}
              className={cn(
                'flex flex-col items-center gap-1 text-[11px] font-medium tracking-tight transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-full border border-transparent transition-colors',
                  isActive
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'bg-transparent'
                )}
              >
                <item.icon className="h-4 w-4" />
              </div>
              <span>{item.title}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
