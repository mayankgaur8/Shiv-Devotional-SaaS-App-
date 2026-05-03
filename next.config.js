/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true'

const nextConfig = {
  ...(isGitHubPages && {
    output: 'export',
    basePath: '/Shiv-Devotional-SaaS-App-',
    trailingSlash: true,
  }),
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
