/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/7.x/avataaars/svg',
      },
      // ✅ Allow Unsplash images
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Allows any path under images.unsplash.com
      },
    ],
  },
};

export default nextConfig;
