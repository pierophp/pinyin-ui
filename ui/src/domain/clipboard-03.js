// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceIdeogramsToSpace from 'src/helpers/special-ideograms-chars';
import replaceall from 'replaceall';
import Promise from 'bluebird';

function parseJW(link) {
  return new Promise((resolve, reject) => {
    http
      .get(`jw/download?url=${link}`)
      .then((response) => {
        resolve(response.data.text);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function parseContent(content) {
  return new Promise((resolve) => {
    const lines = content
      .split('\n')
      .filter((line) => line)
      .filter((line) => {
        if (line.match(/(\d{2}):(\d{4}):(\d{2})/)) {
          return null;
        }

        return line;
      });

    resolve(lines);
  });
}

export default function (content) {
  const siteJwOrg = 'https://www.jw.org';
  const isJwOrg = content.trim().substr(0, siteJwOrg.length) === siteJwOrg;
  return new Promise((resolve) => {
    let contentPromise;
    if (isJwOrg) {
      contentPromise = parseJW(content);
    } else {
      content = replaceall('+', '', content);
      contentPromise = parseContent(content);
    }

    contentPromise.then((lines) => {
      const promissesLines = [];
      const numberRegex = new RegExp('^[0-9]+$');
      lines.forEach((line) => {
        if (typeof line === 'string') {
          line = { text: line };
        }

        promissesLines.push(new Promise((resolveLine, rejectLine) => {
          const row = [];

          if (line.type !== undefined && (line.type === 'img' || line.type === 'box-img')) {
            row.push({
              p: '',
              c: '',
              small: line.small,
              large: line.large,
            });
            row[0].line = {};
            row[0].line.type = line.type;
            resolveLine(row);
            return;
          }

          // Convert NO-BREAK SPACE to SPACE
          line.text = replaceall(String.fromCharCode(160), ' ', line.text);

          if (line.text.split(' ').length === 1) {
            http
              .post('segmentation/segment', {
                ideograms: line.text,
              })
              .then((response) => {
                response.data.ideograms.forEach((char) => {
                  row.push({
                    p: '',
                    c: char,
                  });
                });

                if (line.type !== undefined) {
                  row[0].line = {};
                  row[0].line.type = line.type;
                }

                resolveLine(row);
              })
              .catch((error) => {
                rejectLine(error);
              });

            return;
          }

          const specialWord = 'JOIN_SPECIAL';

          // separate by numbers
          line.text = line.text
                        .split(/(\d+)/)
                        .map((item) => {
                          if (numberRegex.test(item)) {
                            item = ` ${item}${specialWord} `;
                          }
                          return item;
                        })
                        .join('');

          replaceIdeogramsToSpace.forEach((item) => {
            line.text = replaceall(item, ` ${item}${specialWord} `, line.text);
          });

          // remove double spaces
          if (line.text) {
            line.text = line.text.replace(/\s{2,}/g, ' ').trim();
          }

          const ideograms = line.text.split(' ');
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

          if (line.type !== undefined) {
            row[0].line = {};
            row[0].line.type = line.type;
          }

          resolveLine(row);
        }));
      });

      Promise.all(promissesLines).then((rows) => {
        resolve(rows);
      });
    });
  });
}
