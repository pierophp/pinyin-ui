const program = require('commander');
const UnihanDatabaseParser = require('./services/UnihanDatabaseParser');

program.option('-p, --pinyin [type]', 'Pinyin');
program.option('-i, --ideogram [type]', 'Ideogram');
program.parse(process.argv);

UnihanDatabaseParser.saveWord(program.pinyin, program.ideogram).then(() => {
  process.exit();
});
