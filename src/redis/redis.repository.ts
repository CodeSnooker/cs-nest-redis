import { Inject, Injectable } from '@nestjs/common';
import { RedisClient } from 'redis';

@Injectable()
export class RedisRepository {
  constructor(
    // tslint:disable-next-line: variable-name
    @Inject('DbRedisToken') private readonly _redisClient: RedisClient,
  ) {}

  get(key: string): Promise<string> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.get(key, (error, result) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(result);
        }
      });
    });
  }

  put(key: string, value: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.set(key, value, (a, b) => {
        return resolve(b === 'OK');
      });
    });
  }

  hset(key: string, field: string, value: string) {
    return new Promise(async (resolve, reject) => {
      this._redisClient.hset(key, field, value, (a, b) => {
        if (a) {
          return reject(a);
        }
        return resolve(b);
      });
    });
  }

  hget(key: string, field: string) {
    return new Promise(async (resolve, reject) => {
      this._redisClient.hget(key, field, (a, b) => {
        if (a) {
          return reject(a);
        }
        return resolve(b);
      });
    });
  }

  hmset(key: string, data: any) {
    return new Promise(async (resolve, reject) => {
      this._redisClient.hmset(key, data, (a, b) => {
        if (a) {
          return reject(a);
        }
        return resolve(b);
      });
    });
  }

  hmgetall(key: string): Promise<{}> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.hgetall(key, (a, b) => {
        if (a) {
          return reject(a);
        }
        return resolve(b);
      });
    });
  }

  incr(key: string, by: number = 1) {
    return new Promise(async (resolve, reject) => {
      this._redisClient.incrby(key, by, (a, b) => {
        if (a) {
          return reject(a);
        }
        return resolve(b);
      });
    });
  }

  keys(pattern: string) {
    return new Promise(async (resolve, reject) => {
      this._redisClient.keys(pattern, (a, b) => {
        if (a) {
          return reject(a);
        } else {
          return resolve(b);
        }
      });
    });
  }

  setExpiry(key: string, expiryInSeconds: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.EXPIRE(key, expiryInSeconds, (a, b) => {
        return resolve(true);
      });
    });
  }

  setExiryToMidnight(key: string): Promise<boolean> {
    const seconds: number = this.secondsToMidnight();
    return this.setExpiry(key, seconds);
  }

  putWithExpiry(key: string, value: string, expiryInSeconds: number): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.SETEX(key, expiryInSeconds, value, (a, b) => {
        return resolve(b === 'OK');
      });
    });
  }

  private secondsToMidnight(): number {
    const date: Date = new Date();
    const midNight: Date = new Date();
    midNight.setHours(23, 59, 0);
    const delay: number = (midNight.getTime() - date.getTime()) / 1000;
    return delay;
  }

  putWithMidnightExpiry(key: string, value: string): Promise<boolean> {
    const seconds: number = this.secondsToMidnight();
    return this.putWithExpiry(key, value, seconds);
  }

  remove(key: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.del(key, (err, result) => {
        return resolve(true);
      });
    });
  }

  exists(key: string): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      this._redisClient.exists(key, (a, b) => {
        return resolve(b === 1);
      });
    });
  }

  async flush() {
    this._redisClient.flushdb();
  }

  async disconnect() {
    return this._redisClient.end(false);
  }
}
