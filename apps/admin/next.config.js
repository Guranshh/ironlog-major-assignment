import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: fileURLToPath(new URL("../../", import.meta.url)), // the repo root, so Prisma's engine is included on Vercel
};

export default nextConfig;