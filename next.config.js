/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    INFURA_KEY: process.env.INFURA_KEY,
    INFURA_SECRET: process.env.INFURA_SECRET,
  },
};

module.exports = nextConfig;
