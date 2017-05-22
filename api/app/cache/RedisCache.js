const Promise = require('bluebird');
const redis = require('redis');
const env = require('../../env');

Promise.promisifyAll(redis.RedisClient.prototype);
const redisClient = redis.createClient({
  host: env.redis_host,
});

module.exports = class RedisCache {
  static async get(cacheKey) {
    return await redisClient.getAsync(cacheKey);
  }

  static async set(cacheKey, cacheValue, expires) {
    await redisClient.set(cacheKey, cacheValue);
    if (expires) {
      await redisClient.expire(cacheKey, expires);
    }
  }
};
