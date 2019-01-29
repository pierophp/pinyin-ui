// Multi NWT
import isChinese from 'src/helpers/is-chinese';
import compact from 'lodash/compact';

export default function(content) {
  content = content.replace(/(\r\n|\n|\r)/gm, ' ');

  const parts = compact(content.split(' '));
  const rows = [];
  const row = [];
  let char = '';
  let pinyin = '';

  parts.forEach(part => {
    if (isChinese(part)) {
      char = part;
      row.push({
        p: pinyin,
        c: char,
      });
      char = '';
      pinyin = '';
    } else {
      if (pinyin) {
        row.push({
          p: pinyin,
          c: char,
        });
        char = '';
      }

      pinyin = part;
    }
  });

  if (pinyin) {
    row.push({
      p: pinyin,
      c: char,
    });
  }

  rows.push(row);

  return new Promise(resolve => {
    resolve(rows);
  });
}
