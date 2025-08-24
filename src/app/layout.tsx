import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { Geist, Geist_Mono } from 'next/font/google'
import { SidebarProvider } from '@/components/ui/sidebar'
import { getLibrary, getStreamUrl } from '@/app/actions'
import { PlayerWrapper } from '@/components/player-wrapper'
import { TitleManager } from '@/components/title-manager'
import './globals.css'
import { Header } from '@/components/header'
import { AppSidebar } from '@/components/app-sidebar'
import { MobileTabs } from '@/components/mobile-tabs'

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
  title: 'Keertan',
  description: 'A modern web music player',
  icons: {
    icon: '/images/keertan-icon.png',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  userScalable: false,
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="icon"
          type="image/png"
          sizes="196x196"
          href="/images/favicon-196.png"
        />
        <link rel="apple-touch-icon" href="/images/apple-icon-180.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${customFont.variable} antialiased`}
      >
        <SidebarProvider defaultOpen={false}>
          <TitleManager library={library} />
          <div className="min-h-screen w-full flex flex-col">
            <Header />
            <div className="flex-1 flex py-16">
              <AppSidebar />
              <main className="flex-1 overflow-auto pb-24 md:pb-0">
                {children}
              </main>
            </div>
            <div className="fixed bottom-16 md:bottom-0 left-0 right-0 z-50">
              <PlayerWrapper library={library} getStreamUrl={getStreamUrl} />
            </div>
            <MobileTabs />
          </div>
        </SidebarProvider>
      </body>
    </html>
  )
}
