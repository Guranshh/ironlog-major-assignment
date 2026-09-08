/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["sqlite3", "pg", "mongodb"], // native compiled modules — Next loads them from node_modules at runtime instead of trying to bundle them
};

export default nextConfig;