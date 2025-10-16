import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  // Webpack optimizations for WSL cross-filesystem performance
  webpack: (config, { isServer }) => {
    // Reduce file watching overhead
    config.watchOptions = {
      poll: 1000, // Check for changes every second instead of continuous watching
      aggregateTimeout: 300, // Delay rebuild after change
      ignored: ['**/node_modules', '**/.git', '**/.next'], // Don't watch these directories
    };

    // Reduce filesystem lookups
    config.snapshot = {
      managedPaths: [/^(.+?[\\/]node_modules[\\/])/],
      immutablePaths: [],
    };

    return config;
  },

  // Experimental optimizations
  experimental: {
    // Tree-shake large icon packages
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

export default withNextIntl(nextConfig);
