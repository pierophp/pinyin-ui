const program = require('commander');
const Pleco = require('./services/Pleco');

program.parse(process.argv);

Pleco.export().then(() => {
  process.exit();
});
