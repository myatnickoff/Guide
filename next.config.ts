import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: "/sos", destination: "/practical/sos", permanent: false }];
  },
};
export default nextConfig;
