/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "homerentai-images.s3.eu-west-2.amazonaws.com",
        protocol: "https",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: [
      "@aws-sdk/client-s3",
      "@aws-sdk/s3-request-presigner",
    ],
  },
};

export default nextConfig;
