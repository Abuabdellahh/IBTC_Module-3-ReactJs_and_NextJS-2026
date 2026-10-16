import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add trusted image hosts here when loading remote images.
      // Example:
      // {
      //   protocol: 'https',
      //   hostname: 'images.example.com',
      //   pathname: '/**',
      // },
    ],
  },
}

export default nextConfig
