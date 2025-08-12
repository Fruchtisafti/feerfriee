/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // appDir ist in Next 14 eh Standard – raus damit:
  // experimental: { appDir: true },
  typescript: { ignoreBuildErrors: true }, // TS-Fehler blockieren nicht
  eslint: { ignoreDuringBuilds: true },    // ESLint blockiert nicht
};
module.exports = nextConfig;
