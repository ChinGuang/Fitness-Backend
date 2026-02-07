import Redis from 'ioredis';

export class RedisModule {
  private static redis: Redis = new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
  static async hset(payload: { key: string, field: string, value: string, expireInSec: number }): Promise<void> {
    const { key, field, value, expireInSec } = payload;
    await this.redis.hset(key, field, value);
    await this.redis.hexpire(key, expireInSec, 'FIELDS', field)
  }

  static async hget(payload: { key: string, field: string }): Promise<string | null> {
    const { key, field } = payload;
    const result = await this.redis.hget(key, field);
    return result;
  }
}
