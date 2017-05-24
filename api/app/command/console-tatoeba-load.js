const program = require('commander');
const Tatoeba = require('../services/Tatoeba');

program.parse(process.argv);

Tatoeba.import().then(() => {
  process.exit();
});
