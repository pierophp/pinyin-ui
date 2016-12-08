
export default function (pinyin) {
  const vowels = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔùüǖǘǚǜ';

  return pinyin
    // eslint-disable-next-line
    .replace(new RegExp('([' + vowels + '])([^' + vowels + 'nr])', 'g'), '$1 $2') // This line does most of the work
    // eslint-disable-next-line
    .replace(new RegExp('(\w)([csz]h)'), '$1 $2') // double-consonant initials
    // eslint-disable-next-line
    .replace(new RegExp('(n)([^' + vowels + 'vg])'), '$1 $2') // cleans up most n compounds
    // eslint-disable-next-line
    .replace(new RegExp('([' + vowels + 'v])([^' + vowels + '\w\s])([' + vowels + 'v])'), '$1 $2$3') // assumes correct Pinyin (i.e., no missing apostrophes)
    // eslint-disable-next-line
    .replace(new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])'), '$1$2 $3$4') // assumes correct Pinyin, i.e. changan = chan + gan
    // eslint-disable-next-line
    .replace(new RegExp('([gr])([^' + vowels + '])'), '$1 $2'); // fixes -ng and -r finals not followed by vowels

    // .replace(new RegExp('([^e\w\s])(r)'), '$1 $2'); // r an initial, except in er
}
