'use client'

import { useState, useCallback } from 'react'
import { Menu, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { useSidebar } from '@/components/ui/sidebar'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import logo from '/public/images/keertan-logo.png'
import keertanIcon from '../../public/images/keertan-icon.png'

export function Header() {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { toggleSidebar } = useSidebar()
  const router = useRouter()

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const query = searchQuery.trim()
      if (query) {
        router.push(`/search?q=${encodeURIComponent(query)}`)
      }
      setShowSearch(false)
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
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500 pointer-events-none" />
              <Input
                type="search"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10"
                autoFocus
                tabIndex={12}
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
      <header className="fixed top-0 z-40 w-full pl-2 pr-8 backdrop-blur-sm bg-white dark:bg-gray-900/80 border-b border-gray-200 dark:border-gray-700">
        <div className="flex h-14 items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            className="mr-4 justify-self-start hidden md:inline-flex"
            onClick={toggleSidebar}
          >
            <Menu className="h-8 min-w-8" />
          </Button>

          <Link href={'/'}>
            <Image
              src={keertanIcon}
              alt="Keertan Icon"
              width={25}
              height={25}
              className="rounded-full min-w-12 sm:hidden"
            />
            <Image
              src="/images/keertan-logo.png"
              alt="Keertan Logo"
              width={120}
              height={120}
              priority
              className="rounded-full min-w-32 hidden sm:block"
            />
          </Link>

          {/* Mobile Quote */}
          <div className="md:hidden min-w-[13rem] ml-auto text-2xl text-gray-500 dark:text-gray-400 italic font-punjabiBook">
            {quote}
          </div>

          {/* Desktop Search */}
          <div className="hidden ml-12 md:flex items-center w-full max-w-sm mx-8 relative">
            <Search className="absolute left-3 w-4 h-4 text-gray-500 pointer-events-none" />
            <Input
              type="search"
              placeholder="Search..."
              tabIndex={12}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  const query = e.currentTarget.value.trim()
                  if (query) {
                    router.push(`/search?q=${encodeURIComponent(query)}`)
                  }
                }
              }}
              className="w-full pl-10"
            />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden ml-auto text-muted-foreground"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-5 w-5" />
            Search
          </Button>

          {/* Quote */}
          <div className="hidden min-w-[13rem] md:block ml-auto text-2xl text-gray-500 dark:text-gray-400 italic font-punjabiBook">
            {quote}
          </div>
        </div>
      </header>
    </>
  )
}
