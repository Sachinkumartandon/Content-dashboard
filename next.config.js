/** @type {import('next').NextConfig} */
const nextConfig = {

  // ─── Image Optimization ───────────────────────────────────────────────────
  images: {
    unoptimized: true, // ← FIXES all image 404 errors instantly
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        pathname: '/t/p/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: '*.newsapi.org',
      },
    ],
  },

  // ─── Environment Variables ────────────────────────────────────────────────
  env: {
    NEXT_PUBLIC_APP_NAME: 'ContentDash',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },

  // ─── Security Headers ─────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options',  value: 'nosniff'                    },
          { key: 'X-Frame-Options',         value: 'DENY'                       },
          { key: 'X-XSS-Protection',        value: '1; mode=block'              },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },

  // ─── Redirects ────────────────────────────────────────────────────────────
  async redirects() {
    return [
      {
        source:      '/home',
        destination: '/',
        permanent:   true,
      },
    ]
  },
}

module.exports = nextConfig