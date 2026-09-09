import type { NextConfig } from "next";

const SUBSTACK = "https://jonathanpolitzki.substack.com";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/credo", destination: "/", permanent: false },
      { source: "/connect", destination: "/", permanent: false },
      { source: "/interests", destination: "/", permanent: false },
      { source: "/work", destination: "/", permanent: false },
      { source: "/embeddings", destination: "/", permanent: false },
      { source: "/lab/:path*", destination: "/", permanent: false },
      // The site keeps no writing index; send anyone looking for one to Substack.
      { source: "/writing", destination: SUBSTACK, permanent: false },
      { source: "/writing/read", destination: SUBSTACK, permanent: false },
      { source: "/writing/dashboard", destination: SUBSTACK, permanent: false },
    ];
  },
};

export default nextConfig;
