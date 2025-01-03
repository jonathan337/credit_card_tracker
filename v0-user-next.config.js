/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  basePath: '/credit_card_tracker',
  assetPrefix: '/credit_card_tracker/',
  trailingSlash: true, // Add this to ensure proper static file generation
}

module.exports = nextConfig

