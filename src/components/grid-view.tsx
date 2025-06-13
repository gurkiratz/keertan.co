import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'

type GridItem = {
  id: string
  name: string
  tracks?: string[]
  artwork_url?: string
}

type GridViewProps = {
  title: string
  items: GridItem[]
  baseUrl: string
}

export function GridView({ title, items, baseUrl }: GridViewProps) {
  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 2xl:grid-cols-8 gap-3 md:gap-4 lg:gap-6">
        {items.map((item) => (
          <Link href={`${baseUrl}/${item.id}`} key={item.id} className="group">
            <div className="cursor-pointer transition-all duration-200 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 rounded-lg p-2 md:p-3 -m-2 md:-m-3">
              <div className="space-y-2 md:space-y-3">
                {/* Album artwork */}
                <div className="relative w-full aspect-square rounded-md md:rounded-lg overflow-hidden shadow-md group-hover:shadow-xl transition-all duration-200 group-hover:scale-105">
                  <Image
                    src={item?.artwork_url || '/images/unknown-album.png'}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 14vw"
                  />

                  {/* Hover overlay with play button effect */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-200">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-primary-foreground ml-0.5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Text content */}
                <div className="space-y-0.5 md:space-y-1 min-h-0">
                  <h3 className="font-medium text leading-tight truncate group-hover:text-primary transition-colors duration-200">
                    {item.name}
                  </h3>
                  <p className="text-[10px] text-sm text-muted-foreground/80 truncate">
                    {item.tracks?.length
                      ? `${item.tracks.length} tracks`
                      : 'Album'}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
