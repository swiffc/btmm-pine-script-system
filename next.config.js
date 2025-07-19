/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.nextjs.json',
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

export default nextConfig