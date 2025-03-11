/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker deployment
  async rewrites() {
    // Only apply rewrites if the H5P_API_ENDPOINT is defined
    if (process.env.H5P_API_ENDPOINT) {
      return [
        // Proxy requests to the H5P API to avoid CORS issues in development
        {
          source: '/h5p-api/:path*',
          destination: `${process.env.H5P_API_ENDPOINT}/:path*`,
        },
      ];
    }
    
    // Return empty array if H5P_API_ENDPOINT is not defined
    return [];
  },
};

module.exports = nextConfig; 