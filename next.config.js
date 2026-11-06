/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // The chat route reads these at runtime, so they must ship with the function.
    outputFileTracingIncludes: { '/api/chat': ['./content/knowledge/**'] },
  },
}

export default nextConfig
