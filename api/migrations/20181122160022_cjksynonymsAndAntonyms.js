exports.up = function(knex, Promise) {
  return knex.schema.table('cjk', function(table) {
    table
      .text('classifications', 255)
      .collate('utf8mb4_general_ci')
      .nullable();
    table
      .text('synonyms', 255)
      .collate('utf8mb4_general_ci')
      .nullable();
    table
      .text('antonyms', 255)
      .collate('utf8mb4_general_ci')
      .nullable();
    table.boolean('is_separable').nullable();
    table
      .text('definition_3lines_en', 255)
      .collate('utf8mb4_general_ci')
      .nullable();
    table
      .text('definition_3lines_es', 255)
      .collate('utf8mb4_general_ci')
      .nullable();
  });
};

exports.down = function(knex, Promise) {};
