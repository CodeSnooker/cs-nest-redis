import { Test, TestingModule } from '@nestjs/testing';
import { redisProvider } from './redis.provider';
import { RedisRepository } from './redis.repository';

describe('RedisService', () => {
  let service: RedisRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...redisProvider, RedisRepository],
    }).compile();

    service = module.get<RedisRepository>(RedisRepository);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('push test', async () => {
    const result = await service.put('lamda', 'surprise');
    expect(result).toBe(true);
  });

  test('pull test', async () => {
    const result = await service.get('lamda');
    expect(result).toBe('surprise');
  });

  test('key exists', async () => {
    const result = await service.exists('lamda');
    expect(result).toBe(true);

    const notExistResult = await service.exists('key-does-not-exists');
    expect(notExistResult).toBe(false);
  });

  test('delete key-value', async () => {
    const result = await service.remove('lamda');
    expect(result).toBe(true);

    const keyExisitsAnymore = await service.exists('lamda');
    expect(keyExisitsAnymore).toBe(false);
  });

  test('disconnect server', async () => {
    // jest.setTimeout(30000);
    await service.disconnect();
    await expect(service.get('lamda')).rejects.toBeInstanceOf(Error);
  });
});
