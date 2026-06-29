/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Convex File Storage sirve imágenes desde el dominio del deployment.
    remotePatterns: [
      { protocol: "https", hostname: "*.convex.cloud" },
    ],
  },
};

export default nextConfig;
