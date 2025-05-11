import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

type GridItem = {
  id: string
  name: string
  tracks?: string[]
}

type GridViewProps = {
  title: string
  items: GridItem[]
  baseUrl: string
}

export function GridView({ title, items, baseUrl }: GridViewProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-12">
        {items.map((item) => (
          <Link href={`${baseUrl}/${item.id}`} key={item.id}>
            <Card className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-0 bg-transparent">
              <CardContent className="p-0">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-3 album-pattern shadow-lg" />
                <div className="space-y-1 text-center">
                  <h3 className="font-medium truncate">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {item.tracks?.length} tracks
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
