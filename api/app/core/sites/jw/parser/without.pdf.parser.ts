import * as backHtmlTags from 'pdf-pinyin/src/core/pinyin/back.html.tags';
import * as fillBoldItalic from 'pdf-pinyin/src/core/pinyin/fill.bold.italic';
import * as replaceall from 'replaceall';
import * as striptags from 'striptags';
import * as isChinese from '../../../../../../shared/helpers/is-chinese';
import * as replaceIdeogramsToSpace from '../../../../../../shared/helpers/special-ideograms-chars';
import { BlockInterface } from '../../../../core/interfaces/block.interface';
import { replaceWords } from '../../../../core/sites/helpers/replace.words';
import { segmentText } from '../../../../core/sites/helpers/segment.text';
import { parseBible } from '../helpers/parse.bible';
import { ParseItemInterface } from '../interfaces/parse.item.interface';

export class WithoutPdfParser {
  public async parse(item: ParseItemInterface): Promise<BlockInterface[]> {
    const text = item.chinese.text!;

    const numberRegex = new RegExp('^[0-9]+$');

    let lineText = '';
    const lineWithoutTags = striptags(text);
    lineText = segmentText(lineWithoutTags);

    const specialWord = 'JOIN_SPECIAL';

    // separate by numbers
    lineText = lineText
      .split(/(\d+)/)
      .map(item => {
        if (numberRegex.test(item)) {
          item = ` ${item}${specialWord} `;
        }
        return item;
      })
      .join('');

    replaceIdeogramsToSpace.forEach(item => {
      lineText = replaceall(item, ` ${item}${specialWord} `, lineText);
    });

    // remove double spaces
    if (lineText) {
      lineText = lineText.replace(/\s{2,}/g, ' ').trim();
    }

    const ideograms = lineText.split(' ');
    const ideogramsFiltered: any[] = [];

    let joinSpecial = '';

    ideograms.forEach(ideogram => {
      if (ideogram === specialWord) {
        return;
      }

      if (
        ideogram.substring(ideogram.length - specialWord.length) === specialWord
      ) {
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

    lineText = ` ${ideogramsFiltered.join(' ')} `;
    lineText = replaceWords(lineText);

    let response: BlockInterface[] = lineText.split(' ').map(item => {
      return {
        c: item,
        p: '',
      };
    });
    const lineWithoutTagsWithoutSpace = replaceall(' ', '', lineWithoutTags);
    response = backHtmlTags(response, lineWithoutTagsWithoutSpace);
    response = fillBoldItalic(response, lineWithoutTagsWithoutSpace);

    if (response.length > 0) {
      response[0].line = {
        type: item.chinese.type,
      };
    }

    let bible;
    for (let item of response) {
      // @ts-ignore
      const tempBible = parseBible(item.tagsStart);
      if (tempBible) {
        bible = tempBible;
      }

      if (bible && !isChinese(item.c, true)) {
        item.b = bible;
        bible = null;
      }
    }

    return response;
  }
}
