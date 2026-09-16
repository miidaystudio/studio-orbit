/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@studio-orbit/types', '@studio-orbit/db'],
  reactStrictMode: true,
};

module.exports = nextConfig;
