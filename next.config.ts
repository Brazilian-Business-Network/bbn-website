import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Responsive widths for full-bleed photos (hero carousel, banners):
    // 640 / 1280 / 1920 / 2560 plus the common phone widths in between.
    deviceSizes: [640, 750, 828, 1080, 1280, 1920, 2560],
    remotePatterns: [
      // Event photos and clips served by Cloudinary.
      { protocol: "https", hostname: "res.cloudinary.com" },
      // YouTube thumbnails for long-form event videos.
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
