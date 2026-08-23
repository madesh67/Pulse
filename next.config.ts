import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: ["gsap", "three", "lenis"],
  },
  devIndicators: false,
  // Allow local network IPs and all tunnel domains for asset loading & HMR in dev
  allowedDevOrigins: [
    "localhost:3000",
    "127.0.0.1:3000",
    "192.168.1.5",
    "192.168.1.8",
    "192.168.*",
    "169.254.*",
    "*.loca.lt",
    "*.pinggy.link",
    "*.pinggy.net",
    "*.pinggy-free.link",
    "*.run.pinggy-free.link",
    "*.free.pinggy.net",
    "*.ngrok.io",
    "*.ngrok-free.app",
    "*.trycloudflare.com",
  ],
};

export default nextConfig;
