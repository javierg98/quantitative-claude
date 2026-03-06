/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // yahoo-finance2 uses Node.js APIs — keep it server-only
    serverComponentsExternalPackages: ['yahoo-finance2'],
  },
}

export default nextConfig
