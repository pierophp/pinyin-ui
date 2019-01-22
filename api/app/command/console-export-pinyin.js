const bluebird = require('bluebird');
const program = require('commander');
const knex = require('./knex');
const fs = bluebird.promisifyAll(require('fs'));
const IdeogramsConverter = require('../core/converter/ideograms.converter')
  .IdeogramsConverter;
const ideogramsConverter = new IdeogramsConverter();

program.parse(process.argv);

async function exportPinyin() {
  const dirname = `${__dirname}/../../../storage/`;

  const result = await knex('cjk').where({
    type: 'W',
  });
  let csvPinyin = 'ideogram;pinyin\n';
  result.forEach(cjk => {
    csvPinyin += `${ideogramsConverter.convertUtf16ToIdeograms(cjk.ideogram)};${
      cjk.pronunciation
    }\n`;
  });

  const filenamePinyin = `${dirname}pinyin.csv`;
  await fs.writeFileAsync(filenamePinyin, csvPinyin);
}

exportPinyin().then(() => {
  process.exit();
});
