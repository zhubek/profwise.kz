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
        // FIRST: Block RSC requests from being cached (highest priority)
        // RSC requests have ?_rsc query param and should never be cached
        source: '/:path(.*)',
        has: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, max-age=0, must-revalidate',
          },
        ],
      },
      {
        // Cache ALL profession pages for 24 hours (wildcard pattern)
        // Matches: /en/professions/all, /en/professions/:id, /en/professions/:id/description, etc.
        source: '/:locale/professions/:path*',
        missing: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      {
        // Cache ALL test pages for 24 hours (wildcard pattern)
        // Matches: /en/tests, /en/tests/:testId, /en/tests/:testId/results, etc.
        source: '/:locale/tests/:path*',
        missing: [
          {
            type: 'query',
            key: '_rsc',
          },
        ],
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800',
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
