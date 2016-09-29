const env = process.env.NODE_ENV || 'development';
const config = require('../../knexfile')[env];
const knex = require('knex');

const params = {
  client: config.client,
  connection: {
    host: config.connection.host,
    user: config.connection.user,
    password: config.connection.password,
    database: config.connection.database,
    charset: config.connection.charset,
  },
};

const knexInstance = knex(params);


// knexInstance.on('query', function (queryData) {
    // console.log(queryData);
// });

module.exports = knexInstance;
