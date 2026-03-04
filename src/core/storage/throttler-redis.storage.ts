import { Injectable } from '@nestjs/common';
import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

/** Mirrors the internal ThrottlerStorageRecord shape from @nestjs/throttler. */
interface ThrottlerStorageRecord {
  readonly totalHits: number;
  readonly timeToExpire: number;
  readonly isBlocked: boolean;
  readonly timeToBlockExpire: number;
}

const THROTTLE_KEY_PREFIX = 'koms:throttle:' as const;

/**
 * Redis-backed throttler storage.
 * Replaces the default in-memory store so rate-limit counters are
 * shared across all API server instances.
 */
@Injectable()
export class ThrottlerRedisStorage implements ThrottlerStorage {
  constructor(private readonly redis: Redis) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ): Promise<ThrottlerStorageRecord> {
    const countKey = `${THROTTLE_KEY_PREFIX}${throttlerName}:${key}`;
    const blockKey = `${THROTTLE_KEY_PREFIX}${throttlerName}:${key}:blocked`;

    const blockedPttl = await this.redis.pttl(blockKey);
    if (blockedPttl > 0) {
      return { totalHits: limit + 1, timeToExpire: 0, isBlocked: true, timeToBlockExpire: blockedPttl };
    }

    const results = await this.redis.pipeline().incr(countKey).pttl(countKey).exec();
    const totalHits = (results?.[0]?.[1] as number) ?? 1;
    const existingPttl = (results?.[1]?.[1] as number) ?? -1;

    if (existingPttl < 0) {
      await this.redis.pexpire(countKey, ttl);
    }

    const timeToExpire = existingPttl > 0 ? existingPttl : ttl;

    if (totalHits > limit) {
      const blockTtl = blockDuration > 0 ? blockDuration : ttl;
      await this.redis.set(blockKey, '1', 'PX', blockTtl);
      return { totalHits, timeToExpire, isBlocked: true, timeToBlockExpire: blockTtl };
    }

    return { totalHits, timeToExpire, isBlocked: false, timeToBlockExpire: 0 };
  }
}
