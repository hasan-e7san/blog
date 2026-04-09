import type { NextConfig } from "next";

const serverActionAllowedOrigins = [
  "blog.hasan-ehsan.cloud",
  ...(process.env.SERVER_ACTIONS_ALLOWED_ORIGINS
    ? process.env.SERVER_ACTIONS_ALLOWED_ORIGINS.split(",").map((origin) => origin.trim()).filter(Boolean)
    : []),
];

const nextConfig: NextConfig = {
  experimental: {
    workerThreads: true,
    serverActions: {
      allowedOrigins: Array.from(new Set(serverActionAllowedOrigins)),
    },
  },
};

export default nextConfig;
