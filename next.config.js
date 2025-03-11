/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Proxy requests to the H5P API to avoid CORS issues in development
      {
        source: '/h5p-api/:path*',
        destination: `${process.env.H5P_API_ENDPOINT}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig; 