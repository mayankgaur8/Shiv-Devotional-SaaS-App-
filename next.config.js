/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  output: isStaticExport ? 'export' : 'standalone',
  ...(isStaticExport && {
    basePath: '/Shiv-Devotional-SaaS-App-',
    trailingSlash: true,
  }),
  async headers() {
    return [
      {
        source: '/media/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
