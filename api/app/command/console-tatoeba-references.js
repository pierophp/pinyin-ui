const program = require('commander');
const Tatoeba = require('../services/Tatoeba');

program.parse(process.argv);

Tatoeba.references().then(() => {
  process.exit();
});
