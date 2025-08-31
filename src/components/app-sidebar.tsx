'use client'
import { Disc, Home, Library, ListMusic, X } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { useSidebar } from '@/components/ui/sidebar'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

// Menu items.
const items = [
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
  {
    title: 'Tracks',
    url: '/',
    icon: ListMusic,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { toggleSidebar, state } = useSidebar()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Sidebar collapsible="icon" className="hidden md:flex">
      <SidebarContent className="md:mt-14">
        <SidebarGroup>
          <SidebarGroupLabel className="-ml-2 mt-1 mb-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="mr-4"
              onClick={toggleSidebar}
            >
              <X className="h-8 w-8" />
            </Button>
            <Link href={'/'}>
              {mounted && (
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/keertan-logo-dark.png'
                      : '/images/keertan-logo-light.png'
                  }
                  alt="Keertan Logo"
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              )}
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className={cn(
                    pathname === item.url ? 'bg-sidebar-accent rounded-lg' : ''
                  )}
                >
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <item.icon className="text-primary" />
                          </TooltipTrigger>
                          {state === 'collapsed' && (
                            <TooltipContent side="right">
                              {item.title}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        {state === 'expanded' && (
          <div className="md:-mt-32">
            Powered by
            <Link href="https://ibroadcast.com" target="_blank">
              {mounted && (
                <Image
                  src={
                    theme === 'dark'
                      ? '/images/ibroadcast-dark.svg'
                      : '/images/ibroadcast-light.svg'
                  }
                  alt="iBroadcast Logo"
                  width={120}
                  height={120}
                />
              )}
            </Link>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
