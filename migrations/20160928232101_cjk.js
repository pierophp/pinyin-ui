
exports.up = function(knex, Promise) {
  return knex.schema.table('cjk', function (table) {
        table.renameColumn('definition', 'definition_unihan');
        table.text('definition_cedict', 255);
        table.text('definition_pt', 255);
  });
};

exports.down = function(knex, Promise) {
  
};
