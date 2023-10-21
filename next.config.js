/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'tetris.ams3.cdn.digitaloceanspaces.com',
            },
        ],
    },
}

module.exports = nextConfig
