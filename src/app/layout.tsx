import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { Geist, Geist_Mono } from 'next/font/google'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getLibrary, getStreamUrl } from '@/app/actions'
import { Player } from '@/components/player'
import './globals.css'
import { Header } from '@/components/header'
import { AppSidebar } from '@/components/app-sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const customFont = localFont({
  src: '../../public/punjabi-font-book.ttf',
  display: 'swap',
  variable: '--font-punjabi-book',
})

export const metadata: Metadata = {
  title: 'Keertan - Music Player',
  description: 'A modern web music player',
}

export const fetchCache = 'default-cache'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const library = await getLibrary()

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont.variable} antialiased`}
      >
        <SidebarProvider defaultOpen={false}>
          <div className="min-h-screen w-full flex flex-col">
            <Header />
            <div className="flex-1 flex py-16">
              <AppSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </div>
            <Player library={library} getStreamUrl={getStreamUrl} />
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
