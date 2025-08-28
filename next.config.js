/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com', 'lh3.googleusercontent.com'],
  },
  // Disable static generation completely to avoid SSR issues
  output: 'standalone',
  experimental: {
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
  // Disable static generation for all pages
  trailingSlash: true,
}

module.exports = nextConfig 