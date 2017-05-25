const Promise = require('bluebird');
const knex = require('../../services/knex');

let transaction;
let i = 0;

module.exports = class RepositoryManager {
  static async getTransaction() {
    if (transaction) {
      return transaction;
    }

    return await this.newTransaction();
  }

  static async newTransaction() {
    return new Promise((resolve) => {
      knex.transaction((t) => {
        i += 1;
        console.log(`New Tx ${i}`);
        transaction = t;
        resolve(t);
      });
    });
  }

  static async beginTransaction() {
    return new Promise((resolve) => {
      knex.transaction((t) => {
        resolve(t);
      });
    });
  }

  static async commit() {
    const trx = await this.getTransaction();
    await trx.commit();
    knex.destroy();
    return await this.newTransaction();
  }

  static async rollBack() {
    const trx = await this.getTransaction();
    await trx.rollback();
    return await this.newTransaction();
  }
};
