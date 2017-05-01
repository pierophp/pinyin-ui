// JW ORG (spaced)
import http from 'src/helpers/http';
import replaceIdeogramsToSpace from 'src/helpers/special-ideograms-chars';
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

  const numberRegex = new RegExp('^[0-9]+$');
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

    // Convert NO-BREAK SPACE to SPACE
    line.text = replaceall(String.fromCharCode(160), ' ', line.text);

    if (line.text.split(' ').length === 1) {
      const response = await http.post('segmentation/segment', {
        ideograms: line.text,
      });

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

      return row;
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

    line.text = replaceall('<b>', ' <b> ', line.text);
    line.text = replaceall('</b>', ' </b> ', line.text);

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

    let isBold = 0;

    ideogramsFiltered.forEach((char) => {
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
