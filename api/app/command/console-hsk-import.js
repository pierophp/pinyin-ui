const program = require('commander');
const HSKImporter = require('../services/HSKImporter');

program.parse(process.argv);

HSKImporter.import().then(() => {
  process.exit();
});
