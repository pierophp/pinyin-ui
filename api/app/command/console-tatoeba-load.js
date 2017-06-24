const program = require('commander');
const Tatoeba = require('../services/Tatoeba');

program.parse(process.argv);

async function run() {
  await Tatoeba.filter();
  await Tatoeba.import();
  process.exit();
}

run();
