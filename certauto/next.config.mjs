/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    // Add webpack configuration to handle canvas dependency
    webpack: (config, { isServer }) => {
        // Handle canvas module on the server-side
        if (isServer) {
            config.externals = [...config.externals, 'canvas', 'konva'];
        }

        // Optionally add fallbacks for problematic Node.js modules
        config.resolve.fallback = {
            ...config.resolve.fallback,
            canvas: false,
        };

        return config;
    },
    // Avoid issues with image optimization for canvas-generated images
    images: {
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
};

export default nextConfig;
