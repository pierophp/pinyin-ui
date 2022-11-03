// eslint-disable-next-line
import separatePinyinInSyllables from 'src/helpers/separate-pinyin-in-syllables';
import compact from 'lodash/compact';
export default function(content) {
  const rows = [];
  const row = [];
  const lines = compact(content.split('\n'));

  const hanziLine = lines[0];
  const pinyinLine = lines[1];

  const pinyinWords = pinyinLine.split(' ');

  let i = 0;

  pinyinWords.forEach(pinyinWord => {
    const words = separatePinyinInSyllables(pinyinWord);
    let pinyin = '';
    let char = '';

    words.forEach(word => {
      const hanziWord = hanziLine.substr(i, 1);
      pinyin += word;
      char += hanziWord;
      i += 1;
    });

    row.push({
      p: pinyin,
      c: char,
    });

    rows.push(row);
  });

  return new Promise(resolve => {
    resolve(rows);
  });
}
