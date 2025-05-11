import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'artwork.ibroadcast.com',
        protocol: 'https',
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'refactored-pancake-94vxw577xr9f74j4-3000.app.github.dev',
        'localhost:3000',
      ],
    },
  },
}

export default nextConfig
