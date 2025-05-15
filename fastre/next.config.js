/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Required for Next.js to resolve node modules in pdfjs-dist and mammoth
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
      crypto: false,
      canvas: false,
      stream: false,
      zlib: false,
    };
    return config;
  }
}

module.exports = nextConfig 