import Redis from 'ioredis';
import config from './config.js';

const redis14 = new Redis({
  port: config.redis.port,
  host: config.redis.host,
  password: config.redis.password,
  db: 14,
});

export { redis14 };
