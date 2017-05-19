const program = require('commander');
const CjkRepository = require('./repository/CjkRepository');

program.parse(process.argv);
CjkRepository.searchPronunciationByWord('服务');
process.exit();
