import { createClient, RedisClient } from 'redis';
import { RedisConfiguration } from './redis.config';

export const redisProvider = [
  {
    provide: 'DbRedisToken',
    useFactory: async (): Promise<RedisClient> => createClient(RedisConfiguration),
  },
];
