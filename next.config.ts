import type { NextConfig } from "next";

/**
 * Static-export-first configuration.
 * The same `npm run build` output (out/) deploys to GitHub Pages and Vercel.
 * Set NEXT_PUBLIC_BASE_PATH=/<repo-name> only for GitHub Project Pages.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  images: {
    // No image optimizer exists on static hosts, so assets ship unoptimized.
    unoptimized: true,
  },
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: { dirs: ["app", "components", "lib"] },
};

export default nextConfig;
