import { SetMetadata } from '@nestjs/common';

export const CACHE_TTL_KEY = 'cache_ttl';
export const CACHE_KEY_PREFIX = 'cache_key_prefix';

/**
 * Decorator to enable caching for a route with custom TTL
 * @param ttl Time to live in seconds
 * @param keyPrefix Optional prefix for cache key (defaults to controller/method name)
 */
export const CacheResponse = (ttl: number, keyPrefix?: string) => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    SetMetadata(CACHE_TTL_KEY, ttl)(target, propertyKey, descriptor);
    if (keyPrefix) {
      SetMetadata(CACHE_KEY_PREFIX, keyPrefix)(target, propertyKey, descriptor);
    }
    return descriptor;
  };
};
