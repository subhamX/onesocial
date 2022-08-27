/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: "/graphql",
        destination: `${process.env.SERVER_URL}/graphql`, // Proxy to Backend
      },
      {
        source: "/api/:slug*",
        destination: `${process.env.SERVER_URL}/api/:slug*`, // Proxy to Backend
      },
    ];
  },
};

module.exports = removeImports(nextConfig);
