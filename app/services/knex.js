const env = process.env.NODE_ENV || 'development';
const config = require(`${__dirname}/../../knexfile`)[env];
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

const knex = require('knex')(params);


// knex.on('query', function (queryData) {
    // console.log(queryData);
// });

module.exports = knex;
