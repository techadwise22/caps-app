/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['img.youtube.com', 'i.ytimg.com', 'lh3.googleusercontent.com'],
  },
  // Disable static generation for pages that use browser APIs
  experimental: {
    // This will help with SSR issues
    serverComponentsExternalPackages: ['@supabase/supabase-js'],
  },
}

module.exports = nextConfig 