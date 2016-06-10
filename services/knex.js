var env = process.env.NODE_ENV || 'development';
var config = require(__dirname + '/../knexfile')[env];
var params = {
    client: config.client,
    connection: {
        host: config.connection.host,
        user: config.connection.user,
        password: config.connection.password,
        database: config.connection.database,
        charset: config.connection.charset
    }
};

var knex = require('knex')(params);

knex.on('query', function (queryData) {
    //console.log(queryData);
});

module.exports = knex;