import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/news", destination: "/signals", permanent: true },
      { source: "/news/:slug", destination: "/signals/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
