/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'piytfaopdlxltdczdvtk.supabase.co',
      },
    ],
  },
}

module.exports = nextConfig
