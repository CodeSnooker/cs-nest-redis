import { Test, TestingModule } from '@nestjs/testing';
import { RedisModule, RedisRepository } from './../src/public-api';

describe('RedisModule (e2e)', () => {
  let repository: RedisRepository;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [RedisModule],
    }).compile();

    repository = moduleFixture.get<RedisRepository>(RedisRepository);
  });

  it('repository should be defined', () => {
    expect(repository).toBeDefined();
  });

  it('disconnect the client', async () => {
    expect(async () => {
      await repository.disconnect();
    }).not.toThrow();
  });
});
