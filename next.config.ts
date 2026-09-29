import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Event photos and clips served by Cloudinary.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // YouTube thumbnails for long-form event videos.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
