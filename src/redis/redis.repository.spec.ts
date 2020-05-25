import { Test, TestingModule } from '@nestjs/testing';
import { redisProvider } from './redis.provider';
import { RedisRepository } from './redis.repository';

interface TestData {
  age: number;
  date: Date;
  name: string;
}

const TEST_KEY: string = 'lamda';

describe('RedisService', () => {
  let service: RedisRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [...redisProvider, RedisRepository],
    }).compile();

    service = module.get<RedisRepository>(RedisRepository);
  });

  beforeEach(async () => {
    await service.remove(TEST_KEY);
  });

  test('should be defined', () => {
    expect(service).toBeDefined();
  });

  test('save object', async () => {
    const data: TestData = { age: 12, date: new Date('2018-12-30T18:30:00.000+00:00'), name: 'Paras' };
    const result = await service.storeObject<TestData>('lamda', data);
    expect(result).toBeDefined();
  });

  test('get object', async () => {
    const data: TestData = { age: 12, date: new Date('2018-12-30T18:30:00.000+00:00'), name: 'Paras' };
    await service.storeObject<TestData>('lamda', data);
    const result = await service.getObject<TestData>('lamda');
    expect(result).toBeDefined();

    // let compare object
    expect(result.age).toStrictEqual(data.age);
    expect(result.date).toStrictEqual(data.date.toISOString());
    expect(result.name).toStrictEqual(data.name);
  });

  test('get object - does not exists', async () => {
    const result = await service.getObject<TestData>('lamda');
    expect(result).toBeUndefined();
  });

  test('push test', async () => {
    const result = await service.put('lamda', 'surprise');
    expect(result).toBe(true);
  });

  test('pull test', async () => {
    await service.put('lamda', 'surprise');
    const result = await service.get('lamda');
    expect(result).toBe('surprise');
  });

  test('key exists', async () => {
    await service.put('lamda', 'surprise');
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

  test('hset', async () => {
    const result = await service.hset(TEST_KEY, 'ace', 'lace');
    expect(result).toBeTruthy();

    const data = await service.hget(TEST_KEY, 'ace');
    expect(data).toStrictEqual('lace');

    const notExistData = await service.hget(TEST_KEY, 'base');
    expect(notExistData).toBeFalsy();
  });

  test('hmget', async () => {
    await service.hmset('lamda', { ace: 'lace', base: 'lbase', case: 'lcase', dice: 'ldice' });
    const result = await service.hmget('lamda', ['ace', 'case', 'maze']);
    expect(result).toBeDefined();

    expect(result.ace).toStrictEqual('lace');
    expect(result.case).toStrictEqual('lcase');
    expect(result.maze).toBeFalsy();

    const result2 = await service.remove('lamda');
    expect(result2).toBe(true);

    const keyExisitsAnymore = await service.exists('lamda');
    expect(keyExisitsAnymore).toBe(false);
  });

  test('hgetall', async () => {
    await service.hmset('lamda', { ace: 'lace', base: 'lbase', case: 'lcase', dice: 'ldice' });
    const result = await service.hgetall('lamda');
    expect(result).toBeDefined();

    const result2 = await service.remove('lamda');
    expect(result2).toBe(true);

    const keyExisitsAnymore = await service.exists('lamda');
    expect(keyExisitsAnymore).toBe(false);
  });

  test('delete field from hset', async () => {
    await service.hmset('lamda', { ace: 'lace', base: 'lbase', case: 'lcase', dice: 'ldice' });
    const result = await service.hdel('lamda', 'base');
    expect(result).toBe(true);

    const baseValue = await service.hget('lamda', 'base');
    expect(baseValue).toBeNull();
  });

  test('delete multiple fields from hset', async () => {
    await service.hmset('lamda', { ace: 'lace', base: 'lbase', case: 'lcase', dice: 'ldice' });
    const result = await service.hdel('lamda', ['base', 'case', 'dice']);
    expect(result).toBe(true);

    const baseValue = await service.hget('lamda', 'base');
    const caseValue = await service.hget('lamda', 'case');
    const diceValue = await service.hget('lamda', 'dice');

    expect(baseValue).toBeNull();
    expect(caseValue).toBeNull();
    expect(diceValue).toBeNull();
  });

  test('disconnect server', async () => {
    // jest.setTimeout(30000);
    await service.disconnect();
    await expect(service.get('lamda')).rejects.toBeInstanceOf(Error);
  });
});
