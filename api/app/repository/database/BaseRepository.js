const RepositoryManager = require('./RepositoryManager');

module.exports = class BaseRepository {
  static async getTransaction() {
    return await RepositoryManager.getTransaction();
  }

  static async getMysqlConnection() {
    return await RepositoryManager.getMysqlConnection();
  }
};
