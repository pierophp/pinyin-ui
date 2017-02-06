// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceIdeogramsToSpace from 'src/helpers/special-ideograms-chars';
import replaceall from 'replaceall';
import Promise from 'bluebird';

export default function (content) {
  content = replaceall('+', '', content);
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

        const specialWord = 'JOIN_SPECIAL';

        // separate by numbers
        line = line.split(/(\d+)/).join(`${specialWord} `);

        // remove double spaces
        replaceIdeogramsToSpace.forEach((item) => {
          line = replaceall(item, ` ${item}${specialWord} `, line);
        });

        line = line.replace(/\s{2,}/g, ' ').trim();
        const ideograms = line.split(' ');
        const ideogramsFiltered = [];

        let joinSpecial = '';

        ideograms.forEach((ideogram) => {
          if (ideogram === specialWord) {
            return;
          }

          if (ideogram.substring(ideogram.length - specialWord.length) === specialWord) {
            joinSpecial += ideogram.replace(specialWord, '');
            return;
          } else if (joinSpecial) {
            ideogramsFiltered.push(joinSpecial);
            joinSpecial = '';
          }

          ideogramsFiltered.push(ideogram);
        });

        if (joinSpecial) {
          ideogramsFiltered.push(joinSpecial);
        }

        ideogramsFiltered.forEach((char) => {
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
