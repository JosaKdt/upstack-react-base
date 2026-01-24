/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/backend/:path*',
        destination: 'https://upstack-react-base.onrender.com/api/v1/:path*',
      },
    ]
  },
}

export default nextConfig
