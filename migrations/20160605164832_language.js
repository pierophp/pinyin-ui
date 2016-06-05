
exports.up = function (knex, Promise) {
    return knex.schema.createTable('language', function (table) {
        table.increments();
        table.string('code');
        table.unique('code');
        table.string('name');
        table.timestamps();
    });
};

exports.down = function (knex, Promise) {

};
