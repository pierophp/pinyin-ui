// Ideograms
import http from 'src/helpers/http';
import replaceall from 'replaceall';

export default async function(content) {
  content = replaceall('+', '', content);

  const lines = content.split('\n').filter(item => item);

  const rows = [];
  for (let line of lines) {
    // remove double spaces
    line = line.replace(/\s{2,}/g, ' ').trim();

    if (!line) {
      continue;
    }

    const response = await http.post('segmentation/segment', {
      ideograms: line,
    });

    const row = [];
    response.data.ideograms.forEach(char => {
      row.push({
        p: '',
        c: char,
      });
    });

    rows.push(row);
  }

  return rows;
}
