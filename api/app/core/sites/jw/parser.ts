import * as bluebird from 'bluebird';
import * as cheerio from 'cheerio';
import * as moment from 'moment';
import * as getPdfParsedObject from 'pdf-pinyin/src/core/get.pdf.parsed.object';
import * as replaceall from 'replaceall';
import * as replaceIdeogramsToSpace from '../../../../../shared/helpers/special-ideograms-chars';
import * as env from '../../../../env';
import { BlockInterface } from '../../../core/interfaces/block.interface';
import { profiler } from '../../../helpers/profiler';
import { AbstractParser } from '../abstract.parser';
import { Downloader as GenericDownloader } from '../downloader';
import { ParserResponseInterface } from '../interfaces/parser.response.interface';
import { AudioParser } from './parser/audio.parser';
import { SummaryParser } from './parser/summary.parser';
import { PdfParser } from './pdf.parser';
import { TextInterface } from '../interfaces/text.interface';
import { DomParser } from './parser/dom.parser';

export class Parser extends AbstractParser {
  protected isChinese: boolean;
  protected pdfParsedObjectPromise?: Promise<any>;
  protected promisesToExecute: (() => Promise<TextInterface[]>)[];
  protected profilePdfParseStart;
  protected profilePdfParseEnd;
  protected withSpecials;

  public async parse(
    $: CheerioStatic,
    isChinese: boolean,
    withSpecials: boolean = true,
  ): Promise<ParserResponseInterface> {
    this.isChinese = isChinese;
    this.withSpecials = withSpecials;

    $('.viewOptions').remove();
    $('noscript').remove();
    $('#docSubVideo').remove();
    $('#docSubImg').remove();

    if (
      ($('.toc').length > 0 && $('article .docSubContent').length === 0) ||
      $('#musicTOC').length > 0
    ) {
      const summaryParser = new SummaryParser();
      return await summaryParser.parse($);
    }

    await this.getPinyinPdf($);

    return await this.getContent($);
  }

  public async getContent($: CheerioStatic): Promise<ParserResponseInterface> {
    const downloadResponse: ParserResponseInterface = {
      text: [],
    };

    if (this.isChinese) {
      const audioParser = new AudioParser();
      downloadResponse.audio = await audioParser.parse($);
    }

    const domParser = new DomParser();
    this.promisesToExecute = domParser.parse($, this.isChinese);

    const mainImage = $('.lsrBannerImage');
    if (mainImage.length) {
      this.promisesToExecute.push(
        async (): Promise<TextInterface[]> => {
          return [
            {
              large: $(mainImage)
                .find('span')
                .attr('data-zoom'),
              small: $(mainImage)
                .find('span')
                .attr('data-img-size-lg'),
              type: 'img',
            },
          ];
        },
      );
    }

    if ($('article header h1').length) {
      this.promisesToExecute.push(
        async (): Promise<TextInterface[]> => {
          return await this.parseResult($, $('article header h1'), 'h1');
        },
      );
    }

    const mainElements = [
      'article > .docSubContent .textSizeIncrement > div[class=""]',
      'article > .docSubContent .textSizeIncrement',
      'article > .docSubContent',
      'article #bibleText',
      'article .docSubContent',
      '#dailyText',
      '#article',
    ];

    let mainElement: any;
    for (const me of mainElements) {
      mainElement = $(me);
      if (mainElement.length) {
        break;
      }
    }

    for (const children of mainElement.children().toArray()) {
      if ($(children).hasClass('blockTeach')) {
        const boxH2 = $(children).find('aside h2');
        if (boxH2 && $(boxH2).text()) {
          this.promisesToExecute.push(
            async (): Promise<TextInterface[]> => {
              return await this.parseResult($, boxH2, 'h2');
            },
          );
        }

        await this.parseBlock($, $(children).find('.boxContent'));
      } else if ($(children).hasClass('bodyTxt')) {
        for (const subChildren of $(children)
          .children()
          .toArray()) {
          const boxH2 = $(subChildren).children('h2');
          if (boxH2 && $(boxH2).text()) {
            this.promisesToExecute.push(
              async (): Promise<TextInterface[]> => {
                return await this.parseResult($, boxH2, 'h2');
              },
            );
          }

          let bodyTxtChildren = $(subChildren).children('div.pGroup');

          if (bodyTxtChildren.length === 0) {
            bodyTxtChildren = $(subChildren).children('div');
          }

          for (const subChildren02 of bodyTxtChildren.children().toArray()) {
            await this.parseBlock($, subChildren02);
          }
        }
      } else if ($(children).hasClass('article')) {
        for (const subChildren of $(children)
          .children()
          .toArray()) {
          if ($(subChildren).hasClass('questions')) {
            for (const subChildren02 of $(subChildren)
              .children()
              .toArray()) {
              if ($(subChildren02).get(0).tagName === 'h2') {
                this.promisesToExecute.push(
                  async (): Promise<TextInterface[]> => {
                    return await this.parseResult($, subChildren02, 'box-h2');
                  },
                );
              } else if ($(subChildren02).get(0).tagName === 'ul') {
                for (const subChildren03 of $(subChildren02)
                  .children()
                  .toArray()) {
                  await this.parseContent($, subChildren03, 'box');
                }
              } else {
                await this.parseContent($, subChildren02, 'box');
              }
            }
          } else {
            await this.parseBlock($, subChildren);
          }
        }
      } else {
        await this.parseBlock($, children);
      }
    }

    profiler(
      'Start Process promises ' + (this.isChinese ? 'CHINESE' : 'LANGUAGE'),
    );

    const result = await bluebird.map(
      this.promisesToExecute,
      async promiseFunction => {
        const response = await promiseFunction();
        console.log();
        return response;
      },
      { concurrency: 10 },
    );

    if (this.profilePdfParseStart) {
      profiler(
        `Pdf Parse Time ${this.profilePdfParseStart} - ${
          this.profilePdfParseEnd
        }`,
      );
    }

    let text: any[] = [];
    for (const item of result) {
      text = text.concat(item);
    }

    downloadResponse.text = text;

    return downloadResponse;
  }

  public async parseWithPdf(
    text,
    footNoteIds: string[],
  ): Promise<BlockInterface[] | undefined> {
    const pdfParser = new PdfParser();

    let lineJustIdeograms = replaceall(' ', '', text);

    lineJustIdeograms = replaceall('BI#[', '<bible text="', lineJustIdeograms);
    lineJustIdeograms = replaceall(']#BI', '">', lineJustIdeograms);
    lineJustIdeograms = replaceall(']#ENDBI', '</bible>', lineJustIdeograms);

    for (const footNoteId of footNoteIds) {
      lineJustIdeograms = replaceall(
        `#FOOTNOTE${footNoteId}`,
        `<footnote id="${footNoteId}">`,
        lineJustIdeograms,
      );

      lineJustIdeograms = replaceall(
        `#ENDFOOTNOTE${footNoteId}`,
        '</footnote>',
        lineJustIdeograms,
      );
    }

    const lines = lineJustIdeograms
      .trim()
      .split('\r\n')
      .filter(item => item);

    if (!this.profilePdfParseStart) {
      this.profilePdfParseStart = moment().format('HH:mm:ss');
    }

    const parsedResult = await pdfParser.parse(
      this.pdfParsedObjectPromise!,
      lines,
    );

    this.profilePdfParseEnd = moment().format('HH:mm:ss');

    return parsedResult;
  }

  public async parseWithoutPdf(
    text: string,
    bibles,
    footNoteIds: string[],
  ): Promise<string> {
    const numberRegex = new RegExp('^[0-9]+$');

    if (this.withSpecials) {
      text = replaceall(']#ENDBI', '', text);

      for (const footNoteId of footNoteIds) {
        text = replaceall(`#ENDFOOTNOTE${footNoteId}`, '', text);
        text = replaceall(`#FOOTNOTE${footNoteId}`, '#FOOTNOTE', text);
      }
    }

    let lineText = '';
    lineText = this.segmentText(text);

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

    // bold
    lineText = replaceall('< b >', '<b>', lineText);
    lineText = replaceall('< /b >', '</b>', lineText);

    lineText = replaceall(`<${specialWord} b >${specialWord}`, '<b>', lineText);
    lineText = replaceall(
      `<${specialWord} /b >${specialWord}`,
      '</b>',
      lineText,
    );
    lineText = replaceall(
      `<${specialWord} / b >${specialWord}`,
      '</b>',
      lineText,
    );

    lineText = replaceall('<b>', ' <b> ', lineText);
    lineText = replaceall('</b>', ' </b> ', lineText);

    // italic
    lineText = replaceall('< i >', '<i>', lineText);
    lineText = replaceall('< /i >', '</i>', lineText);

    lineText = replaceall(`<${specialWord} i >${specialWord}`, '<i>', lineText);
    lineText = replaceall(
      `<${specialWord} / i >${specialWord}`,
      '</i>',
      lineText,
    );
    lineText = replaceall(
      `<${specialWord} /i >${specialWord}`,
      '</i>',
      lineText,
    );

    lineText = replaceall('<i>', ' <i> ', lineText);
    lineText = replaceall('</i>', ' </i> ', lineText);

    if (!this.withSpecials) {
      lineText = replaceall('<b>', '', lineText);
      lineText = replaceall('</b>', '', lineText);
      lineText = replaceall('<i>', '', lineText);
      lineText = replaceall('</i>', '', lineText);
    }
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

    lineText = this.replaceWords(lineText);

    if (footNoteIds.length) {
      const footNoteId = footNoteIds[0];

      lineText = replaceall(
        '# FOOTNOTE',
        ` #FOOTNOTE-${footNoteId}-`,
        lineText,
      );

      lineText = replaceall(
        '# F O O T N O T E',
        ` #FOOTNOTE-${footNoteId}-`,
        lineText,
      );

      lineText = replaceall('- *', '-*', lineText);
    }

    if (bibles.length > 0 && this.isChinese) {
      // separate ）from numbers
      lineText = lineText.replace(/([1-9])(）)/g, '$1 $2');
      lineText = replaceall('BI #[', ' BI#[', lineText);
      lineText = replaceall(']# BI', ']#BI ', lineText);
      lineText = replaceall('B I #[', 'BI#[', lineText);
      lineText = replaceall(']# B I', ']#BI', lineText);
      lineText = lineText.replace(/\s{2,}/g, ' ').trim();
    }

    return this.trim(lineText);
  }

  protected async getPinyinPdf($) {
    if (!this.isChinese) {
      return;
    }

    const download = $('.digitalPubFormat .jsDownload');
    let href = '';
    download.each((i, children) => {
      if (href) {
        return;
      }

      if (children.attribs.href.indexOf('PDF') !== -1) {
        href = children.attribs.href;
      }
    });

    if (href) {
      const downloader = new GenericDownloader();
      const content = await downloader.download(href);

      let $pdf = cheerio.load(content);

      const links = $pdf('.standardDownloadResults a');
      const pdfPinyinList: any[] = [];
      links.each((i, children) => {
        if (children.attribs.href.indexOf('.pdf') === -1) {
          return;
        }

        if (children.attribs.href.indexOf('-Pi_') === -1) {
          return;
        }

        pdfPinyinList.push(children.attribs.href);
      });

      let dirname = `${__dirname.replace(
        'dist/api/',
        '',
      )}/../../../../storage/`;
      if (env.storage_path) {
        dirname = `${env.storage_path}`;
      }

      if (pdfPinyinList.length) {
        const pdfPinyin = pdfPinyinList.join('|||');
        this.pdfParsedObjectPromise = getPdfParsedObject(pdfPinyin, true, {
          dirname,
        });
      }
    }
  }
}
