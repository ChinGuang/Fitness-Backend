import Redis from 'ioredis';

export class RedisModule {
  private static redis: Redis = new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
  static async hset(payload: { key: string, field: string, value: string, expireInSec: number }): Promise<void> {
    const { key, field, value, expireInSec } = payload;
    await this.redis.hset(key, field, value);
    const numFields = 1;
    await this.redis.hexpire(key, expireInSec, 'FIELDS', numFields, field)
  }

  static async hget(payload: { key: string, field: string }): Promise<string | null> {
    const { key, field } = payload;
    const result = await this.redis.hget(key, field);
    return result;
  }

  static async hdel(payload: { key: string, field: string }): Promise<void> {
    const { key, field } = payload;
    await this.redis.hdel(key, field);
  }
}
