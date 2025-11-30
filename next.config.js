/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['next-mdx-remote'],
    experimental: {
        serverComponentsExternalPackages: ['prisma', '@prisma/client'],
    },
};

module.exports = nextConfig;
