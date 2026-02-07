import Redis from 'ioredis';

export class RedisModule {
  private static redis: Redis = new Redis({
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
  });
  static async hset(payload: { key: string, field: string, value: string, expireInSec: number }): Promise<void> {
    const { key, field, value, expireInSec } = payload;
    await this.redis.hset(key, field, value);
    // ReplyError: ERR wrong number of arguments for 'hexpire' command
    //     at parseError (C:\Users\User\Documents\Github\fitness-backend\node_modules\.pnpm\redis-parser@3.0.0\node_modules\redis-parser\lib\parser.js:179:12)
    //     at parseType (C:\Users\User\Documents\Github\fitness-backend\node_modules\.pnpm\redis-parser@3.0.0\node_modules\redis-parser\lib\parser.js:302:14) {
    //   command: { name: 'hexpire', args: [ 'user-jwt_token', '900', 'FIELDS', '4' ] }
    // }
    const numFields = 1;
    await this.redis.hexpire(key, expireInSec, 'FIELDS', numFields, field)
  }

  static async hget(payload: { key: string, field: string }): Promise<string | null> {
    const { key, field } = payload;
    const result = await this.redis.hget(key, field);
    return result;
  }
}
