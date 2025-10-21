import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Inject,
} from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as CacheManager from 'cache-manager';
import { Reflector } from '@nestjs/core';
import { CACHE_TTL_KEY, CACHE_KEY_PREFIX } from './cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager.Cache,
    private reflector: Reflector,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // Check if caching is enabled
    const isEnabled = process.env.ENABLE_REDIS_CACHE === 'true';
    if (!isEnabled) {
      return next.handle();
    }

    // Get TTL from decorator
    const ttl = this.reflector.get<number>(
      CACHE_TTL_KEY,
      context.getHandler(),
    );

    // If no TTL specified, skip caching
    if (!ttl) {
      return next.handle();
    }

    const request = context.switchToHttp().getRequest();
    const { method, url, params, query, user } = request;

    // Only cache GET requests
    if (method !== 'GET') {
      return next.handle();
    }

    // Generate cache key
    const keyPrefix =
      this.reflector.get<string>(CACHE_KEY_PREFIX, context.getHandler()) ||
      context.getClass().name;
    const cacheKey = this.generateCacheKey(
      keyPrefix,
      url,
      params,
      query,
      user?.id,
    );

    try {
      // Try to get from cache
      const cachedResponse = await this.cacheManager.get(cacheKey);

      if (cachedResponse) {
        console.log(`[Cache HIT] ${cacheKey}`);
        return of(cachedResponse);
      }

      console.log(`[Cache MISS] ${cacheKey}`);

      // If not in cache, execute handler and cache the result
      return next.handle().pipe(
        tap(async (response) => {
          try {
            await this.cacheManager.set(cacheKey, response, ttl * 1000); // Convert to milliseconds
            console.log(`[Cache SET] ${cacheKey} (TTL: ${ttl}s)`);
          } catch (error) {
            console.error(
              `[Cache ERROR] Failed to set cache for ${cacheKey}:`,
              error.message,
            );
          }
        }),
      );
    } catch (error) {
      console.error(
        `[Cache ERROR] Failed to get cache for ${cacheKey}:`,
        error.message,
      );
      // If cache fails, continue without caching
      return next.handle();
    }
  }

  /**
   * Generate a unique cache key based on request parameters
   */
  private generateCacheKey(
    prefix: string,
    url: string,
    params: any,
    query: any,
    userId?: string,
  ): string {
    const parts = [prefix];

    // Extract route path (remove query string)
    const path = url.split('?')[0];
    parts.push(path);

    // Add route params (e.g., :id)
    if (params && Object.keys(params).length > 0) {
      parts.push(JSON.stringify(params));
    }

    // Add query params (sorted for consistency)
    if (query && Object.keys(query).length > 0) {
      const sortedQuery = Object.keys(query)
        .sort()
        .reduce((acc, key) => {
          acc[key] = query[key];
          return acc;
        }, {});
      parts.push(JSON.stringify(sortedQuery));
    }

    // Add user ID for user-specific caches
    if (userId) {
      parts.push(`user:${userId}`);
    }

    return parts.join(':');
  }
}
