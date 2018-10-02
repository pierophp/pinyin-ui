import { Argv, CommandModule } from 'yargs';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { IdeogramsConverter } from '../core/converter/ideograms.converter';
import * as UnihanSearch from '../services/UnihanSearch';
import * as fs from 'fs-extra';

const ideogramsConverter = new IdeogramsConverter();

export class MemriseToInkstoneCommand implements CommandModule {
  public command = 'memrisetoinkstone';
  public describe = 'Memrise to Inkstone';

  public async handler(argv: Argv) {
    const chapters = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

    for (const chapter of chapters) {
      const url = `https://www.memrise.com/course/909679/a-course-in-contemporary-chinese-book-1/${chapter}/`;

      const filename = `contemporary-chinese-B1L${chapter}.list`;

      let response = await axios.get(url);
      let $ = cheerio.load(response.data);

      const items = $('.container .things .thing');

      let result = '';

      const ideogramList: any[] = [];

      items.each((i, item) => {
        let ideogram = '';
        let meaning = '';

        $(item)
          .find('.col_a .text')
          .each((k, text) => {
            ideogram = $(text)
              .text()
              .replace('(', '')
              .replace(')', '')
              .trim();
          });

        $(item)
          .find('.col_b .text')
          .each((k, text) => {
            meaning = $(text).text();
          });

        ideogramList.push({ ideogram, meaning });
      });

      for (const ideogram of ideogramList) {
        result +=
          (await ideogramsConverter.traditionalToSimplified(
            ideogram.ideogram,
          )) + '\t';
        result += ideogram.ideogram + '\t';

        const pinyin = (await UnihanSearch.toPinyin(ideogram.ideogram))
          .map(item => {
            return item.pinyin;
          })
          .join(' ');

        result += pinyin + '\t';
        //  result += pinyin + '\t';
        result += ideogram.meaning;
        result += '\n';
      }

      await fs.writeFile(
        __dirname + `/../../../api/app/data/${filename}`,
        result,
      );
    }

    process.exit();
  }
}
