import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    /* config options here */
    output: "export",
    trailingSlash: true,
    images: {
        unoptimized: true,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
}

export default nextConfig
