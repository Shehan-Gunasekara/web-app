/** @type {import('next').NextConfig} */
const withPWA = require("next-pwa");
const runtimeCaching = require("next-pwa/cache");

const isStandalone = process.env.BUILD_TARGET === "standalone";

const nextConfig = {
  ...withPWA({
    reactStrictMode: true,
    pwa: {
      dest: "public",
      register: true,
      skipWaiting: true,
      runtimeCaching,
      buildExcludes: [/middleware-manifest.json$/],
    },
  }),
  output: isStandalone ? "standalone" : "export",
  images: { unoptimized: true },
};

module.exports = nextConfig;
