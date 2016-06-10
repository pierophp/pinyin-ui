
exports.up = function (knex, Promise) {
    return knex.schema.createTable('cjk', function (table) {
        table.increments();
        table.string('ideogram');
        table.index('ideogram');
        table.string('pronunciation').collate('utf8_bin');
        table.index('pronunciation');
        table.string('pronunciation_unaccented');
        table.index('pronunciation_unaccented');
        table.string('definition');
        table.integer('frequency');
        table.integer('usage');
        table.integer('language_id').notNullable().unsigned().index().references('language.id');
        table.timestamps();
    });
};

exports.down = function (knex, Promise) {

};
