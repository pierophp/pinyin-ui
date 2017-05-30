const program = require('commander');
const Tatoeba = require('../services/Tatoeba');

program.parse(process.argv);

Tatoeba.filter().then(() => {
  process.exit();
});

/*
Tatoeba.import().then(() => {
  process.exit();
});
*/
