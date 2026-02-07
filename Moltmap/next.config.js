const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // GLSL shader support
    config.module.rules.push({
      test: /\.glsl$/,
      type: 'asset/source',
    });

    // Cesium configuration
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        cesium: path.resolve(__dirname, 'node_modules/cesium'),
      };

      // Copy Cesium assets
      config.plugins = config.plugins || [];
    }

    // Ignore Cesium warnings
    config.ignoreWarnings = [
      /Failed to parse source map/,
      /Critical dependency: the request of a dependency is an expression/,
    ];

    return config;
  },
  // Set Cesium base URL
  env: {
    CESIUM_BASE_URL: '/cesium',
  },
}

module.exports = nextConfig
