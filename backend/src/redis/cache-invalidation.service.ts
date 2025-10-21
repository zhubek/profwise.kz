import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import * as CacheManager from 'cache-manager';

@Injectable()
export class CacheInvalidationService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: CacheManager.Cache) {}

  /**
   * Invalidate cache by specific key
   */
  async invalidateKey(key: string): Promise<void> {
    const isEnabled = process.env.ENABLE_REDIS_CACHE === 'true';
    if (!isEnabled) return;

    try {
      await this.cacheManager.del(key);
      console.log(`[Cache INVALIDATE] ${key}`);
    } catch (error) {
      console.error(`[Cache ERROR] Failed to invalidate key ${key}:`, error.message);
    }
  }

  /**
   * Invalidate cache by pattern (e.g., 'quizzes:*')
   * Note: This requires accessing the underlying Redis client
   */
  async invalidatePattern(pattern: string): Promise<void> {
    const isEnabled = process.env.ENABLE_REDIS_CACHE === 'true';
    if (!isEnabled) return;

    try {
      // Access the underlying store (Keyv instance)
      const store: any = (this.cacheManager as any).store;

      // Try to get Redis client from Keyv's nested structure
      // @keyv/redis stores the client in different places depending on version
      let redisClient: any = null;

      // Method 1: Direct access to Keyv's store
      if (store && store.opts && store.opts.store && store.opts.store.redis) {
        redisClient = store.opts.store.redis;
      }
      // Method 2: Check if store itself has redis property
      else if (store && store.redis) {
        redisClient = store.redis;
      }
      // Method 3: Check if store has client property
      else if (store && store.client) {
        redisClient = store.client;
      }

      if (redisClient) {
        // Get all keys matching pattern with profwise namespace
        const keys = await redisClient.keys(`profwise:${pattern}`);

        if (keys && keys.length > 0) {
          // Delete all matching keys
          await Promise.all(keys.map((key: string) => redisClient.del(key)));
          console.log(`[Cache INVALIDATE PATTERN] ${pattern} (${keys.length} keys deleted)`);
        } else {
          console.log(`[Cache INVALIDATE PATTERN] ${pattern} (0 keys matched)`);
        }
      } else {
        console.warn('[Cache WARNING] Cannot invalidate pattern - Redis client not accessible from Keyv store');
        console.warn('[Cache DEBUG] Store structure:', JSON.stringify(Object.keys(store || {})));
      }
    } catch (error) {
      console.error(`[Cache ERROR] Failed to invalidate pattern ${pattern}:`, error.message);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    const isEnabled = process.env.ENABLE_REDIS_CACHE === 'true';
    if (!isEnabled) return;

    try {
      // Use pattern invalidation to clear all profwise-namespaced keys
      await this.invalidatePattern('*');
      console.log('[Cache CLEAR] All cache cleared');
    } catch (error) {
      console.error('[Cache ERROR] Failed to clear all cache:', error.message);
    }
  }

  /**
   * Invalidate quiz-related caches
   */
  async invalidateQuizzes(quizId?: string): Promise<void> {
    if (quizId) {
      await this.invalidatePattern(`*quizzes/${quizId}*`);
      await this.invalidatePattern(`*quizzes:user:*`); // User-specific quiz lists
    } else {
      await this.invalidatePattern(`*quizzes*`);
    }
  }

  /**
   * Invalidate profession-related caches
   */
  async invalidateProfessions(professionId?: string): Promise<void> {
    if (professionId) {
      await this.invalidatePattern(`*professions/${professionId}*`);
      await this.invalidatePattern(`*user:*:professions*`); // User profession matches
    } else {
      await this.invalidatePattern(`*professions*`);
    }
  }

  /**
   * Invalidate archetype-related caches
   */
  async invalidateArchetypes(archetypeId?: string): Promise<void> {
    if (archetypeId) {
      await this.invalidatePattern(`*archetypes/${archetypeId}*`);
    } else {
      await this.invalidatePattern(`*archetypes*`);
    }
  }

  /**
   * Invalidate user-specific caches
   */
  async invalidateUserCaches(userId: string): Promise<void> {
    await this.invalidatePattern(`*user:${userId}:*`);
    await this.invalidatePattern(`*users/${userId}*`);
  }

  /**
   * Invalidate category-related caches
   */
  async invalidateCategories(categoryId?: string): Promise<void> {
    if (categoryId) {
      await this.invalidatePattern(`*categories/${categoryId}*`);
    } else {
      await this.invalidatePattern(`*categories*`);
    }
  }

  /**
   * Invalidate university-related caches
   */
  async invalidateUniversities(universityId?: string): Promise<void> {
    if (universityId) {
      await this.invalidatePattern(`*universities/${universityId}*`);
    } else {
      await this.invalidatePattern(`*universities*`);
    }
  }

  /**
   * Invalidate spec-related caches
   */
  async invalidateSpecs(specId?: string): Promise<void> {
    if (specId) {
      await this.invalidatePattern(`*specs/${specId}*`);
    } else {
      await this.invalidatePattern(`*specs*`);
    }
  }

  /**
   * Invalidate user-specific quiz caches
   * Used when user's license changes and quiz access is updated
   */
  async invalidateUserQuizzes(userId: string): Promise<void> {
    await this.invalidatePattern(`*QuizzesController:/quizzes/user/${userId}*`);
    console.log(`[Cache INVALIDATE] User ${userId} quiz cache cleared`);
  }
}
