/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [
            "files.edgestore.dev"
        ]
    },
    // Disable SWC and use Babel instead
    swcMinify: false
}

module.exports = nextConfig