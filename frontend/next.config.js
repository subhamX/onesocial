/** @type {import('next').NextConfig} */

const removeImports = require("next-remove-imports")();

const withPWA = require('next-pwa');({
  dest: 'public'
});


const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = removeImports(withPWA(nextConfig));
