/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverComponentsExternalPackages: ['next-mdx-remote'],
    },
};

module.exports = nextConfig;
