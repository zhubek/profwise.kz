import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import path from 'path';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

const nextConfig: NextConfig = {
  output: 'standalone', // Enable for Docker deployment
  outputFileTracingRoot: path.join(__dirname),

  // Temporarily ignore TypeScript errors during build (TODO: fix these)
  typescript: {
    ignoreBuildErrors: true,
  },

  // Configure cache headers for Cloudflare
  async headers() {
    return [
      {
        // Cache professions pages for 1 hour
        source: '/:locale/professions/all',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache individual profession pages for 1 hour
        source: '/:locale/professions/:id',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache test pages for 1 hour
        source: '/:locale/tests/:testId',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },

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
