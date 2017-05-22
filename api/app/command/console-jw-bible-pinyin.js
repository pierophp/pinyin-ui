const program = require('commander');
const JWDownloader = require('../services/JWDownloader');

program.parse(process.argv);

JWDownloader.getBiblePinyin().then(() => {
  process.exit();
});
