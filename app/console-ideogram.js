
const program = require('commander');
const UnihanDatabaseParser = require('./services/UnihanDatabaseParser');
const udp = new UnihanDatabaseParser();

program.option('-p, --pinyin [type]', 'Pinyin');
program.option('-i, --ideogram [type]', 'Ideogram');
program.parse(process.argv);

udp.saveWord(program.pinyin, program.ideogram).then(() => {
  process.exit();
});
