import { Module, Global } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import Keyv from 'keyv';
import KeyvRedis from '@keyv/redis';
import { CacheInvalidationService } from './cache-invalidation.service';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        // Check if Redis caching is enabled
        const isEnabled = process.env.ENABLE_REDIS_CACHE === 'true';

        if (!isEnabled) {
          console.log('[Redis] Cache disabled via ENABLE_REDIS_CACHE env variable');
          return {
            ttl: 0, // Disable caching
          };
        }

        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379');
        const redisPassword = process.env.REDIS_PASSWORD;
        const defaultTTL = parseInt(process.env.REDIS_DEFAULT_TTL || '3600'); // 1 hour default

        console.log(`[Redis] Connecting to Redis at ${redisHost}:${redisPort}`);

        try {
          // Create Keyv Redis store
          const keyvRedis = new KeyvRedis(`redis://${redisPassword ? `:${redisPassword}@` : ''}${redisHost}:${redisPort}`);

          const keyv = new Keyv({
            store: keyvRedis,
            ttl: defaultTTL * 1000, // Keyv uses milliseconds
            namespace: 'profwise', // Prefix for all keys
          });

          // Test connection
          await keyv.set('test-connection', 'ok', 1000);
          await keyv.delete('test-connection');

          console.log('[Redis] Successfully connected to Redis');

          return {
            store: keyv as any,
            ttl: defaultTTL,
          };
        } catch (error) {
          console.error('[Redis] Failed to connect to Redis:', error.message);
          console.warn('[Redis] Falling back to in-memory cache');

          // Fallback to in-memory cache if Redis is unavailable
          return {
            ttl: defaultTTL,
          };
        }
      },
    }),
  ],
  providers: [CacheInvalidationService],
  exports: [CacheModule, CacheInvalidationService],
})
export class RedisModule {}
