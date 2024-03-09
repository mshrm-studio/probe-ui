/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'probewtf.fra1.cdn.digitaloceanspaces.com',
            },
        ],
    },
}

module.exports = nextConfig
