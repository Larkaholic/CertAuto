/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable React strict mode to avoid double-rendering issues with Konva
  reactStrictMode: false,
  
  // Handle canvas/jsdom server-side issues
  webpack: (config) => {
    // Fix canvas module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      'canvas': false,
      'jsdom': false,
    };
    
    // Ensure React is properly resolved
    config.resolve.alias['react'] = require.resolve('react');
    config.resolve.alias['react-dom'] = require.resolve('react-dom');
    
    return config;
  },
  
  // Enable transpilation for ant design packages
  transpilePackages: ['antd', '@ant-design/icons', '@ant-design/cssinjs'],
};

module.exports = nextConfig;
