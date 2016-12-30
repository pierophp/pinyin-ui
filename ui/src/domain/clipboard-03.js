// JW ORG (spaced)
import replaceall from 'replaceall';

export default function (content) {
  content = replaceall('+', '', content);

  // separate by numbers
  content = content.split(/(\d+)/).join(' ');

  const replaceIdeogramsToSpace = [
    '，',
    '。',
    '：',
    '；',
    '、',
    '？',
    '（',
    '）',
    '！',
    '“',
    '”',
  ];

  replaceIdeogramsToSpace.forEach((item) => {
    content = replaceall(item, ` ${item} `, content);
  });

  return new Promise((resolve) => {
    const rows = [];
    const lines = content.split('\n').filter((line) => line);

    lines.forEach((line) => {
      const row = [];
      // remove double spaces
      line = line.replace(/\s{2,}/g, ' ').trim();
      const ideograms = line.split(' ');
      ideograms.forEach((char) => {
        row.push({
          p: '',
          c: char,
        });
      });
      rows.push(row);
    });

    resolve(rows);
  });
}
