const program = require('commander');
const UnihanSearch = require('./services/UnihanSeach');

program.parse(process.argv);

UnihanSearch.exportPinyin().then(() => {
  process.exit();
});
