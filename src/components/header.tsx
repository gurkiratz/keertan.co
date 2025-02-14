'use client'

import { useState, useCallback } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type HeaderProps = {
  toggleSidebar?: () => void
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      // Handle search logic here
      console.log('Search query:', searchQuery)
    },
    [searchQuery]
  )

  const quote = 'Blo Blo ry kIrqnIAw ]'

  return (
    <>
      {/* Mobile Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowSearch(false)}
          />
          <div className="relative w-full bg-white dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pr-10"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0"
                onClick={() => setShowSearch(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 w-full flex justify-center backdrop-blur-sm bg-white/40 dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="container flex h-14 items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4"
            onClick={toggleSidebar}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="font-semibold text-xl">Keertan</span>
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center w-full max-w-sm mx-8"
          >
            <Input
              type="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </form>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden ml-auto"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Quote */}
          <div className="hidden md:block ml-auto text-2xl text-gray-500 dark:text-gray-400 italic font-punjabiBook">
            {quote}
          </div>
        </div>
      </header>
    </>
  )
}
