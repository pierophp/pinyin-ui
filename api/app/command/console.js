#!/usr/bin/env node
const program = require('commander');

process.setMaxListeners(0);

program
  .version('0.0.1')
  .command('ideogram', 'Create a ideogram to pinyin database');

program
  .version('0.0.1')
  .command('unihan-load', 'Unihan load');

program
  .version('0.0.1')
  .command('cc-ce-dict-load', 'CC CE Dict load');

program
  .version('0.0.1')
  .command('3lines-load', '3 Lines load');

program
  .version('0.0.1')
  .command('jw-track', 'JW Track');

program
  .version('0.0.1')
  .command('jw-bible', 'JW Bible');

program
  .version('0.0.1')
  .command('jw-bible-pinyin', 'JW Bible Pinyin');

program
  .version('0.0.1')
  .command('jw-insight', 'JW Insight');

program
  .version('0.0.1')
  .command('hsk-import', 'HSK Import');

program
  .version('0.0.1')
  .command('export-pleco', 'Export Pleco');

program
  .version('0.0.1')
  .command('export-pinyin', 'Export Pinyin');

program
  .version('0.0.1')
  .command('test', 'Test');

program.parse(process.argv);
