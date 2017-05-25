const DatabaseRepositoryManager = require('./database/RepositoryManager');

module.exports = class RepositoryManager {
  static async beginTransaction() {
    await DatabaseRepositoryManager.beginTransaction();
  }

  static async commit() {
    await DatabaseRepositoryManager.commit();
  }

  static async rollBack() {
    await DatabaseRepositoryManager.rollBack();
  }
};
