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
        // Don't cache RSC (React Server Components) requests - these are for client-side navigation
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
        // Cache professions pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/all',
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
        // Cache individual profession pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/:id',
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
        // Cache profession sub-pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/:id/description',
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
        // Cache profession education pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/:id/education',
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
        // Cache profession market pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/:id/market',
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
        // Cache profession archetypes pages for 24 hours (only HTML, not RSC)
        source: '/:locale/professions/:id/archetypes',
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
        // Cache test pages for 24 hours (only HTML, not RSC)
        source: '/:locale/tests/:testId',
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
