// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceall from 'replaceall';
import Promise from 'bluebird';

export default function (content) {
  content = replaceall('+', '', content);
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

  return new Promise((resolve) => {
    const lines = content.split('\n').filter((line) => line);
    const promissesLines = [];

    lines.forEach((line) => {
      promissesLines.push(new Promise((resolveLine, rejectLine) => {
        const row = [];

        if (line.split(' ').length === 1) {
          http
            .post('segmentation/segment', {
              ideograms: line,
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
        // separate by numbers
        line = line.split(/(\d+)/).join(' ');

        // remove double spaces
        replaceIdeogramsToSpace.forEach((item) => {
          line = replaceall(item, ` ${item} `, line);
        });
        line = line.replace(/\s{2,}/g, ' ').trim();
        const ideograms = line.split(' ');

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
      console.log(rows);
      resolve(rows);
    });
  });
}
