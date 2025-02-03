import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { SidebarNav } from '@/components/sidebar-nav'
import { Player } from '@/components/player'
import { Providers } from '@/components/providers'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'iBroadcast - Music Player',
  description: 'A modern web music player',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen flex flex-col">
            <div className="flex-1 flex pb-16">
              <aside className="hidden lg:block w-64 bg-gray-100 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
                <SidebarNav />
              </aside>
              <main className="flex-1 overflow-auto">
                <div className="lg:hidden sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 supports-[backdrop-filter]:dark:bg-gray-900/75 border-b border-gray-200 dark:border-gray-700 p-4">
                  <SidebarNav />
                </div>
                {children}
              </main>
            </div>
            <Player />
          </div>
        </Providers>
      </body>
    </html>
  )
}
