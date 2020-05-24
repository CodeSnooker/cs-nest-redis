import { ClientOpts } from 'redis';

export const RedisConfiguration: ClientOpts = {
  host: process.env.CACHE_SERVER || 'localhost',
  port: 6379,
  db: 1,
};
