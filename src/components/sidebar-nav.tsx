'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Library, ListMusic, Disc, Search } from 'lucide-react'

const routes = [
  {
    label: 'Tracks',
    icon: ListMusic,
    href: '/',
  },
  {
    label: 'Playlists',
    icon: Library,
    href: '/playlists',
  },
  {
    label: 'Albums',
    icon: Disc,
    href: '/albums',
  },
]

export function SidebarNav() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <nav className="flex flex-col gap-2 p-4">
      <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800">
        <Search className="w-4 h-4" />
        <textarea
          placeholder="Search..."
          rows={1}
          className="w-full bg-transparent outline-none placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none overflow-hidden"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              const query = e.currentTarget.value.trim()
              if (query) {
                router.push(`/search?q=${encodeURIComponent(query)}`)
              }
            }
          }}
        />
      </div>
      <div className="lg:flex-col flex gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors flex-1 lg:flex-none justify-center lg:justify-start',
              pathname === route.href
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
            )}
          >
            <route.icon className="w-4 h-4 text-primary" />
            {route.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
