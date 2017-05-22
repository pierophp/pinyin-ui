const cache = {};

module.exports = class ArrayCache {
  static async get(cacheKey) {
    return cache[cacheKey];
  }

  static async set(cacheKey, cacheValue) {
    cache[cacheKey] = cacheValue;
  }
};
