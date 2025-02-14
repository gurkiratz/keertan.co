'use client'
import { Disc, Home, Library, ListMusic, X } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
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

// Menu items.
const items = [
  {
    title: 'Home',
    url: '/',
    icon: Home,
  },
  {
    title: 'Tracks',
    url: '/',
    icon: ListMusic,
  },
  {
    title: 'Playlists',
    url: '/playlists',
    icon: Library,
  },
  {
    title: 'Albums',
    url: '/albums',
    icon: Disc,
  },
]

export function AppSidebar() {
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar collapsible="icon">
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
              <Image
                src="/images/keertan-logo.png"
                alt="Keertan Logo"
                width={120}
                height={120}
                className="rounded-full"
              />
            </Link>
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className="space-x-2">
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
