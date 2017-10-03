// Ideograms
import http from 'src/helpers/http';
import replaceall from 'replaceall';
import Promise from 'bluebird';

export default async function (content) {
  content = replaceall('+', '', content);

  const lines = content.split('\n').filter((item) => item);

  return Promise.map(lines, async (line) => {
    // remove double spaces
    line = line.replace(/\s{2,}/g, ' ');

    const response = await http
      .post('segmentation/segment', {
        ideograms: line,
      });

    const row = [];
    response.data.ideograms.forEach((char) => {
      row.push({
        p: '',
        c: char,
      });
    });

    return row;
  });
};
