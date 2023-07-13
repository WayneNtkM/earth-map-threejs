/** @type {import('next').NextConfig} */

const withTM = require('next-transpile-modules')(['three']);
module.exports = withTM();

const nextConfig = {
  images: {
    domains: ['avatars.githubusercontent.com', 'avatar.vercel.sh']
  },
  transpilePackages: ['three']
};

module.exports = nextConfig;
