import { Module } from '@nestjs/common';
import { redisProvider } from './redis.provider';
import { RedisRepository } from './redis.repository';

@Module({
  providers: [...redisProvider, RedisRepository],
  exports: [RedisRepository],
})
export class RedisModule {}
