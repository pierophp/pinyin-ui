// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceall from 'replaceall';
import Promise from 'bluebird';

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
    '《',
    '》',
  ];

  replaceIdeogramsToSpace.forEach((item) => {
    content = replaceall(item, ` ${item} `, content);
  });

  return new Promise((resolve) => {
    const lines = content.split('\n').filter((line) => line);
    const promissesLines = [];

    lines.forEach((line) => {
      promissesLines.push(new Promise((resolveLine, rejectLine) => {
        const row = [];
        // remove double spaces
        line = line.replace(/\s{2,}/g, ' ').trim();
        const ideograms = line.split(' ');

        if (ideograms.length === 1) {
          http
            .post('segmentation/segment', {
              ideograms: content,
            })
            .then((response) => {
              response.data.ideograms.forEach((char) => {
                row.push({
                  p: '',
                  c: char,
                });
              });

              resolveLine(row);
            })
            .catch((error) => {
              rejectLine(error);
            });

          return;
        }

        ideograms.forEach((char) => {
          row.push({
            p: '',
            c: char,
          });
        });

        resolveLine(row);
      }));
    });

    Promise.all(promissesLines).then((rows) => {
      resolve(rows);
    });
  });
}
