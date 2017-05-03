// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceall from 'replaceall';
import Promise from 'bluebird';

async function parseJW(link) {
  const response = await http.get(`jw/download?url=${link}`);
  return response.data;
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

export default async function (content) {
  const siteJwOrg = 'https://www.jw.org';
  const isJwOrg = content.trim().substr(0, siteJwOrg.length) === siteJwOrg;

  let lines;
  let audio = null;
  if (isJwOrg) {
    const jwContent = await parseJW(content);
    lines = jwContent.text;
    audio = jwContent.audio;
  } else {
    content = replaceall('+', '', content);
    lines = await parseContent(content);
  }

  const rows = await Promise.map(lines, async (line) => {
    if (typeof line === 'string') {
      line = { text: line };
    }

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
      return row;
    }

    const ideograms = line.text.split(' ');

    let isBold = 0;

    ideograms.forEach((char) => {
      if (char === '<b>') {
        isBold = 1;
        return;
      }

      if (char === '</b>') {
        isBold = 0;
        return;
      }

      const item = {
        p: '',
        c: char,
      };

      if (isBold === 1) {
        item.isBold = isBold;
      }

      row.push(item);
    });

    if (line.type !== undefined) {
      row[0].line = {};
      row[0].line.type = line.type;
    }

    return row;
  });

  if (audio) {
    rows[0][0].line.audio = audio;
  }

  return rows;
}
