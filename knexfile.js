module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'pinyin',
      user: 'root',
      password: null,
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
    }
  },

  staging: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'pinyin',
      user: 'root',
      password: null,
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
    }
  },

  production: {
    client: 'mysql',
    connection: {
      host: '127.0.0.1',
      database: 'pinyin',
      user: 'root',
      password: 'root',
      charset: 'utf8',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'migrations',
    }
  }

};
