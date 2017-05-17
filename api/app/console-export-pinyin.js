const program = require('commander');
const UnihanSearch = require('./services/UnihanSearch');

program.parse(process.argv);

UnihanSearch.exportPinyin().then(() => {
  process.exit();
});
