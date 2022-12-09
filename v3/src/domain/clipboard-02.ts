// eslint-disable-next-line
import separatePinyinInSyllables from "@/helpers/separate-pinyin-in-syllables";
import compact from "lodash/compact";
export default function (content: any) {
  const rows: any[] = [];
  const row: any[] = [];
  const lines = compact(content.split("\n"));

  const hanziLine = lines[0];
  const pinyinLine = lines[1];

  // @ts-ignore
  const pinyinWords: any[] = pinyinLine.split(" ");

  let i = 0;

  pinyinWords.forEach((pinyinWord) => {
    const words = separatePinyinInSyllables(pinyinWord);
    let pinyin = "";
    let char = "";

    words.forEach((word) => {
      // @ts-ignore
      const hanziWord = hanziLine.substr(i, 1);
      pinyin += word;
      char += hanziWord;
      i += 1;
    });

    row.push({
      p: pinyin,
      c: char,
    });

    rows.push(row);
  });

  return new Promise((resolve) => {
    resolve(rows);
  });
}
