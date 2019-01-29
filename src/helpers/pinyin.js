function getUpperCaseIndices(str) {
  const indices = [];
  for (let i = 0; i < str.length; i += 1) {
    if (str[i] === str[i].toUpperCase()) {
      indices.push(i);
    }
  }
  return indices;
}

function revertToUpperCase(str, indices) {
  const chars = str.split('');
  // eslint-disable-next-line
  indices.map(idx => {
    chars[idx] = chars[idx].toUpperCase();
  });
  return chars.join('');
}

export default function(text) {
  // eslint-disable-next-line
  const tonePtn = /([aeiouvüAEIOUVÜ]{1,2}(n|ng|r|\'er|N|NG|R|\'ER){0,1}[1234])/g;
  const toneMap = {
    a: ['ā', 'á', 'ǎ', 'à'],
    ai: ['āi', 'ái', 'ǎi', 'ài'],
    ao: ['āo', 'áo', 'ǎo', 'ào'],
    e: ['ē', 'é', 'ě', 'è'],
    ei: ['ēi', 'éi', 'ěi', 'èi'],
    i: ['ī', 'í', 'ǐ', 'ì'],
    ia: ['iā', 'iá', 'iǎ', 'ià'],
    ie: ['iē', 'ié', 'iě', 'iè'],
    io: ['iō', 'ió', 'iǒ', 'iò'],
    iu: ['iū', 'iú', 'iǔ', 'iù'],
    o: ['ō', 'ó', 'ǒ', 'ò'],
    ou: ['ōu', 'óu', 'ǒu', 'òu'],
    u: ['ū', 'ú', 'ǔ', 'ù'],
    ua: ['uā', 'uá', 'uǎ', 'uà'],
    ue: ['uē', 'ué', 'uě', 'uè'],
    ui: ['uī', 'uí', 'uǐ', 'uì'],
    uo: ['uō', 'uó', 'uǒ', 'uò'],
    v: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    ve: ['üē', 'üé', 'üě', 'üè'],
    ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
    üe: ['üē', 'üé', 'üě', 'üè'],
  };
  const tones = text.match(tonePtn);
  if (tones) {
    tones.forEach(coda => {
      // eslint-disable-next-line
      const toneIdx = parseInt(coda.slice(-1)) - 1;
      let vowel = coda.slice(0, -1);
      // eslint-disable-next-line
      const suffix = vowel.match(/(n|ng|r|\'er|N|NG|R|\'ER)$/);
      // eslint-disable-next-line
      vowel = vowel.replace(/(n|ng|r|\'er|N|NG|R|\'ER)$/, '');
      const upperCaseIdxs = getUpperCaseIndices(vowel);
      vowel = vowel.toLowerCase();
      // eslint-disable-next-line
      const replacement =
        (suffix && toneMap[vowel][toneIdx] + suffix[0]) ||
        toneMap[vowel][toneIdx];
      text = text.replace(coda, revertToUpperCase(replacement, upperCaseIdxs));
    });
  }
  return text;
}
