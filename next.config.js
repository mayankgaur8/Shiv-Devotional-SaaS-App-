/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  ...(isGitHubPages && {
    output: 'export',
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
