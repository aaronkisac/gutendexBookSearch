import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    imageSizes: [80, 160, 240],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.gutenberg.org',
      },
    ],
  },
}

export default nextConfig
