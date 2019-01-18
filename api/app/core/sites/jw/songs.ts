import * as cheerio from 'cheerio';
import { Downloader as GenericDownloader } from '../downloader';
import { Parser } from './parser';
import { writeFile } from 'fs-extra';

export class Songs {
  public async get(): Promise<void> {
    const baseUrl = 'https://www.jw.org';
    const url = `${baseUrl}/cmn-hans/出版物/音乐/高声欢唱/`;

    const downloader = new GenericDownloader();
    const response = await downloader.download(url);
    const $list = cheerio.load(response);

    const links = $list(
      '.musicList .musicFileContainer .fileTitle a',
    ).toArray();
    let song = 0;

    const parser = new Parser();
    for (const link of links) {
      song++;

      const songLink = baseUrl + $list(link).attr('href');

      const response = await downloader.download(songLink);
      const $ = cheerio.load(response);

      const dirname = `${__dirname}/../../../../../../../ui/public/static/songs/`;

      const parsedDownload = await parser.parse($);

      await writeFile(
        `${dirname}cmn-hans/${song}.json`,
        JSON.stringify({ lines: parsedDownload.text }),
      );
    }
  }
}
