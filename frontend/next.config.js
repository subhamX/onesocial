/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();
const withPWA = require('next-pwa')({
  dest: 'public'
})


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // async rewrites() {
  //   return [
  //     {
  //       source: "/ms/chat/:slug*",
  //       destination: `http://localhost:5000/ms/chat/:slug*`, // Wrong: We want to connect to ws too
  //     },
  //     {
  //       source: "/ms/impact/:slug*",
  //       destination: `${process.env.SERVER_URL}/ms/impact/:slug*`, // Proxy to Backend
  //     },
  //   ];
  // },
};

module.exports = removeImports(withPWA(
  (nextConfig)
));
