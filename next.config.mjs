/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.media-allrecipes.com",
      },
      {
        protocol: "https",
        hostname: "img.spoonacular.com",
      },
    ],
  },
};

export default nextConfig;
