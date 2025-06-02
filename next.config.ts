import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      new URL(
        `${process.env.IMAGEKIT_URL_ENDPOINT}/${process.env.IMAGEKIT_ID}/**`
      ),
    ],
  },
};

export default nextConfig;
