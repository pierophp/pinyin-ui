// Ideograms
import http from 'src/helpers/http';
import replaceall from 'replaceall';

export default function (content) {
  content = replaceall('+', '', content);

  // remove double spaces
  content = content.replace(/\s{2,}/g, ' ');

  return new Promise((resolve, reject) => {
    http
    .post('segmentation/segment', {
      ideograms: content,
    })
    .then((response) => {
      const rows = [];
      const row = [];
      response.data.ideograms.forEach((char) => {
        row.push({
          p: '',
          c: char,
        });
      });

      rows.push(row);
      resolve(rows);
    })
    .catch((error) => {
      reject(error);
    });
  });
}
