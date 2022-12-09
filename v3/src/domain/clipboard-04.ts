// Ideograms
import http from "@/helpers/http";
// @ts-ignore
import replaceall from "replaceall";

export default async function (content: any) {
  content = replaceall("+", "", content);

  const lines = content.split("\n").filter((item: string) => item);

  const rows = [];
  for (let line of lines) {
    // remove double spaces
    line = line.replace(/\s{2,}/g, " ").trim();

    if (!line) {
      continue;
    }

    const response = await http.post("segmentation/segment", {
      ideograms: line,
    });

    const row: any[] = [];
    response.data.ideograms.forEach((char: string) => {
      row.push({
        p: "",
        c: char,
      });
    });

    rows.push(row);
  }

  return rows;
}
