import * as pinyinParser from 'pdf-pinyin/src/core/pinyin.parser';
import * as replaceall from 'replaceall';
import * as isChinese from '../../../../../../shared/helpers/is-chinese';
import { BlockInterface } from '../../../../core/interfaces/block.interface';
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
    if (textSimplified && textSimplified.length !== text.length) {
      return;
    }

    let lineWithoutSpace = replaceall(
      ' ',
      '',
      textSimplified ? textSimplified : text,
    );

    const parsedResult = await this.pdfPinyin(pdfParsedObjectPromise!, [
      lineWithoutSpace,
    ]);

    if (!parsedResult) {
      return;
    }

    if (!textSimplified) {
      return parsedResult;
    }

    const traditionalBlocks = text
      .split(' ')
      .filter(item => item)
      .join('');

    function replaceAt(str: string, index: number, chr: string) {
      if (index > str.length - 1) return str;
      return str.substr(0, index) + chr + str.substr(index + 1);
    }

    let traditionalCounter = 0;
    let blockCounter = 0;
    let i = 0;
    for (const parsedLine of parsedResult) {
      for (const simplifiedBlock of parsedResult) {
        let characterCount = 0;

        if (!simplifiedBlock.c) {
          continue;
        }

        for (const simplifiedC of simplifiedBlock.c.split('')) {
          parsedResult[i][blockCounter].c = replaceAt(
            simplifiedBlock.c,
            characterCount,
            traditionalBlocks[traditionalCounter],
          );
          traditionalCounter++;
          characterCount++;
        }

        blockCounter++;
      }

      i++;
    }

    return parsedResult;
  }

  public async pdfPinyin(
    pdfParsedObjectPromise: Promise<any>,
    lines: string[],
  ): Promise<BlockInterface[] | undefined> {
    const pdfParsedObject: any = await pdfParsedObjectPromise;

    // @ts-ignore
    let result = await pinyinParser(pdfParsedObject, lines);

    if (!result || !result.isReadable) {
      return;
    }

    let bible: any = null;

    return result.lines.map(
      (item): BlockInterface[] => {
        return item.map(
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

              returnItem.footnote = footnote[1];
            }

            return returnItem;
          },
        );
      },
    );
  }
}
