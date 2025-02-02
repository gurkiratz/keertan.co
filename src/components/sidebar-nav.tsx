'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Library, ListMusic, Disc } from 'lucide-react'

const routes = [
  {
    label: 'Tracks',
    icon: ListMusic,
    href: '/tracks',
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

  return (
    <nav className="flex flex-col gap-2 p-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            pathname === route.href
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'
          )}
        >
          <route.icon className="w-4 h-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
