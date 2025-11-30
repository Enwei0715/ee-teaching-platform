/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['next-mdx-remote'],
    experimental: {
        serverComponentsExternalPackages: ['prisma', '@prisma/client', 'katex'],
    },
    webpack: (config) => {
        config.externals = [...(config.externals || []), 'katex'];
        return config;
    },
};

module.exports = nextConfig;
