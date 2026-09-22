import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sqlite3", "pg", "mongodb"], // native modules Next loads at runtime instead of bundling
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)), // the repo root, so Prisma's engine is included on Vercel
};

export default nextConfig;