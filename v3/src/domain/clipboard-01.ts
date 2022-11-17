// Multi NWT
import isChinese from "@/helpers/is-chinese";
import compact from "lodash/compact";

export default function (content: any) {
  content = content.replace(/(\r\n|\n|\r)/gm, " ");

  const parts: string[] = compact(content.split(" "));
  const rows: any[] = [];
  const row = [];
  let char = "";
  let pinyin = "";

  parts.forEach((part) => {
    if (isChinese(part)) {
      char = part;
      row.push({
        p: pinyin,
        c: char,
      });
      char = "";
      pinyin = "";
    } else {
      if (pinyin) {
        row.push({
          p: pinyin,
          c: char,
        });
        char = "";
      }

      pinyin = part;
    }
  });

  if (pinyin) {
    row.push({
      p: pinyin,
      c: char,
    });
  }

  rows.push(row);

  return new Promise((resolve) => {
    resolve(rows);
  });
}
