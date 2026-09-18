import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.unsplash.com" },
      { protocol: "https", hostname: "image.tmdb.org" },
      { protocol: "https", hostname: "**.tmdb.org" },
      { protocol: "https", hostname: "**.cloudinary.com" },
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
};

export default nextConfig;
