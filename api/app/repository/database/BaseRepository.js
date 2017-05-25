const RepositoryManager = require('./RepositoryManager');

module.exports = class BaseRepository {
  static async getTransaction() {
    return await RepositoryManager.getTransaction();
  }
};
