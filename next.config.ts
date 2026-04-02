import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname: "/wikipedia/**",
      },
      {
        protocol: "https",
        hostname: "www.jsums.edu",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "www.jsums.edu",
        pathname: "/studentlifeoperations/files/**",
      },
    ],
  },
};

export default nextConfig;
