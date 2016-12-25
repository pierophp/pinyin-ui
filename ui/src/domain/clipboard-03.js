import replaceall from 'replaceall';

export default function (content) {
  content = replaceall('+', '', content);
  // remove double spaces
  content = content.replace(/\s{2,}/g, ' ');

  return new Promise((resolve) => {
    const ideograms = content.split(' ');
    const row = [];
    ideograms.forEach((char) => {
      row.push({
        p: '',
        c: char,
      });
    });

    resolve(row);
  });
}
