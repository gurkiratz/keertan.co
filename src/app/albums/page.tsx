import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AlbumsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Albums</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Sample data - replace with actual data */}
        <Card>
          <CardHeader>
            <CardTitle>Album Title</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Artist Name
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              12 tracks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Another Album</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-lg mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Different Artist
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">8 tracks</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
