import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/credo", destination: "/", permanent: false },
      { source: "/connect", destination: "/", permanent: false },
      { source: "/interests", destination: "/", permanent: false },
      { source: "/work", destination: "/", permanent: false },
      { source: "/embeddings", destination: "/", permanent: false },
      { source: "/lab/:path*", destination: "/", permanent: false },
      { source: "/writing/read", destination: "/writing", permanent: false },
      { source: "/writing/dashboard", destination: "/writing", permanent: false },
    ];
  },
};

export default nextConfig;
