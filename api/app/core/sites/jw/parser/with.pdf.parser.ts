import * as pinyinParser from 'pdf-pinyin/src/core/pinyin.parser';
import * as striptags from 'striptags';
import * as replaceall from 'replaceall';
import * as isChinese from '../../../../../../shared/helpers/is-chinese';
import { BlockInterface } from '../../../../core/interfaces/block.interface';
import { replaceAt } from '../../../../core/sites/helpers/replace.at';
import { parseBible } from '../helpers/parse.bible';
import { ParseItemInterface } from '../interfaces/parse.item.interface';

export class WithPdfParser {
  public async parse(
    item: ParseItemInterface,
    pdfParsedObjectPromise: Promise<any>,
  ): Promise<BlockInterface[] | undefined> {
    const text: string = item.chinese.text || '';
    const textSimplified: string = item.simplified
      ? item.simplified.text || ''
      : '';

    /**
     * If simplified and traditional paragraph does'n have the same size
     * don't use PDF for traditional
     */

    if (textSimplified) {
      const textSimplifiedVerification = replaceall(' ', '', textSimplified);
      const textVerification = replaceall(' ', '', text);

      if (textSimplifiedVerification.length !== textVerification.length) {
        return;
      }
    }

    const line = textSimplified ? textSimplified : text;

    const parsedResult = await this.pdfPinyin(
      pdfParsedObjectPromise!,
      [line],
      item,
    );

    if (!parsedResult) {
      return;
    }

    if (!textSimplified) {
      return parsedResult;
    }

    return this.restoreTraditional(text, parsedResult);
  }

  protected restoreTraditional(
    text: string,
    parsedResult: BlockInterface[],
  ): BlockInterface[] {
    const traditionalBlocks = striptags(text)
      .split(' ')
      .filter(item => item)
      .join('');

    let traditionalCounter = 0;
    let blockCounter = 0;

    for (const simplifiedBlock of parsedResult) {
      let characterCount = 0;

      if (!simplifiedBlock.c) {
        continue;
      }

      if (!traditionalBlocks[traditionalCounter]) {
        continue;
      }

      for (const simplifiedC of simplifiedBlock.c.split('')) {
        parsedResult[blockCounter].c = replaceAt(
          simplifiedBlock.c,
          characterCount,
          traditionalBlocks[traditionalCounter],
        );
        traditionalCounter++;
        characterCount++;
      }

      blockCounter++;
    }

    return parsedResult;
  }

  public async pdfPinyin(
    pdfParsedObjectPromise: Promise<any>,
    lines: string[],
    parsedItem: ParseItemInterface,
  ): Promise<BlockInterface[] | undefined> {
    const pdfParsedObject: any = await pdfParsedObjectPromise;

    if (!pdfParsedObject) {
      return;
    }

    // @ts-ignore
    let result = await pinyinParser(pdfParsedObject, lines);

    if (!result || !result.isReadable) {
      return;
    }

    if (result.percentNotFound && Math.round(result.percentNotFound) > 5) {
      return;
    }

    let bible: any = null;

    const item: any[] = result.lines[0];

    const line = item.map(
      (item2): BlockInterface => {
        const returnItem: BlockInterface = {
          c: item2.c.join(''),
          p: item2.p.join(String.fromCharCode(160)),
        };

        if (item2.isBold) {
          returnItem.isBold = 1;
        }

        if (item2.isItalic) {
          returnItem.isItalic = 1;
        }

        const tempBible = parseBible(item2.tagsStart);
        if (tempBible) {
          bible = tempBible;
        }

        if (bible && !isChinese(returnItem.c, true)) {
          returnItem.b = bible;
          bible = null;
        }

        let indexOfFootnote = -1;

        if (item2.tagsStart) {
          indexOfFootnote = item2.tagsStart.indexOf('<footnote');
        }

        if (indexOfFootnote >= 0) {
          const footnote = item2.tagsStart.match(/\<footnote id="(.*?)"\>/);

          if (footnote) {
            returnItem.footnote = footnote[1];
          }
        }

        return returnItem;
      },
    );

    if (line.length > 0) {
      line[0].line = {
        pinyin_source: 'pdf',
      };

      if (parsedItem.chinese.type) {
        line[0].line.type = parsedItem.chinese.type;
      }
    }

    if (parsedItem.language && parsedItem.language.text && line.length > 0) {
      line[0].trans = parsedItem.language.text;
    }

    return line;
  }
}
