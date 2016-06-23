
var program = require('commander');
var UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
var udp = new UnihanDatabaseParser();

program.option('-p, --pinyin [type]', 'Pinyin');
program.option('-i, --ideogram [type]', 'Ideogram');
program.parse(process.argv);

udp.saveWord(program.pinyin, program.ideogram).then(function(){
   process.exit(); 
});