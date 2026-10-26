import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  outputFileTracingRoot: path.resolve(__dirname),
  allowedDevOrigins: ["localhost", "127.0.0.1", "127.0.2.2", "*.localhost"],
};

export default nextConfig;
