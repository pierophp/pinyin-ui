import * as replaceall from 'replaceall';
import * as bibleBooks from '../../../../../../shared/data/bible/bible';
import { removeHtmlSpecialTags } from '../../../../core/sites/helpers/remove.html.special.tags';
import { TextInterface } from '../../../../core/sites/interfaces/text.interface';

export class DomParser {
  protected items: TextInterface[];
  protected figcaptionsText: string[] = [];
  protected isChinese: boolean;
  public async parse(
    $: CheerioStatic,
    isChinese: boolean,
  ): Promise<TextInterface[]> {
    this.isChinese = isChinese;
    this.items = [];
    this.figcaptionsText = [];

    $('.viewOptions').remove();
    $('noscript').remove();
    $('#docSubVideo').remove();
    $('#docSubImg').remove();

    /**
     * Main Image Article
     */
    const mainImage = $('.lsrBannerImage');
    if (mainImage.length) {
      this.items.push({
        large: $(mainImage)
          .find('span')
          .attr('data-zoom'),
        small: $(mainImage)
          .find('span')
          .attr('data-img-size-lg'),
        type: 'img',
      });
    }

    /**
     * Main Title Article
     */
    if ($('article header h1').length) {
      this.items = this.items.concat(
        await this.parseResult($, $('article header h1'), 'h1'),
      );
    }

    /**
     * Main Elements Prioriry
     */
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
          this.items = this.items.concat(
            await this.parseResult($, boxH2, 'h2'),
          );
        }

        await this.parseBlock($, $(children).find('.boxContent'));
      } else if ($(children).hasClass('bodyTxt')) {
        for (const subChildren of $(children)
          .children()
          .toArray()) {
          const boxH2 = $(subChildren).children('h2');
          if (boxH2 && $(boxH2).text()) {
            this.items = this.items.concat(
              await this.parseResult($, boxH2, 'h2'),
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
                this.items = this.items.concat(
                  await this.parseResult($, subChildren02, 'box-h2'),
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

    return this.items;
  }

  public async parseBlock($: CheerioStatic, element) {
    if (
      $(element).attr('class') &&
      $(element)
        .attr('class')
        .indexOf('boxSupplement') !== -1
    ) {
      //
      const boxFigure = $(element).find('.fullBleed figure');
      if (boxFigure.length) {
        this.items.push({
          type: 'box-img',
          large: $(boxFigure)
            .find('span')
            .attr('data-zoom'),
          small: $(boxFigure)
            .find('span')
            .attr('data-img-size-lg'),
        });
      }

      const boxH2 = $(element).find('h2');
      if (boxH2 && $(boxH2).text()) {
        this.items = this.items.concat(
          await this.parseResult($, boxH2, 'box-h2'),
        );
      }

      if ($(element).find('.boxContent').length > 0) {
        for (const subChildren of $(element)
          .find('.boxContent')
          .children()
          .toArray()) {
          if ($(subChildren).get(0).tagName === 'ul') {
            for (const subChildrenLi of $(subChildren)
              .children()
              .toArray()) {
              for (const subChildrenLiContent of $(subChildrenLi)
                .children()
                .toArray()) {
                await this.parseContent($, subChildrenLiContent, 'box');
              }
            }
          } else if ($(subChildren).find('.imgGrid').length) {
            for (const subChildrenImgGrid of $(subChildren)
              .find('.imgGrid')
              .toArray()) {
              await this.parseContent($, subChildrenImgGrid, 'box');
            }
          } else {
            await this.parseContent($, subChildren, 'box');
          }
        }
      } else {
        const subBoxH2 = $(element).find('table caption');
        if (subBoxH2 && $(subBoxH2).text()) {
          this.items = this.items.concat(
            await this.parseResult($, subBoxH2, 'box'),
          );
        }

        for (const subChildrenTr of $(element)
          .find('table tr')
          .toArray()) {
          await this.parseContent($, subChildrenTr, 'box');
        }
      }
    } else if (
      $(element).attr('class') &&
      $(element)
        .attr('class')
        .indexOf('groupFootnote') !== -1
    ) {
      for (const subChildren of $(element)
        .children()
        .toArray()) {
        await this.parseContent($, subChildren, 'foot');
      }
    } else {
      await this.parseContent($, element, '');
    }
  }

  public async parseContent(
    $: CheerioStatic,
    element,
    type: string,
  ): Promise<void> {
    if ($(element).hasClass('qu')) {
      type = 'qu';
    }

    if ($(element).hasClass('stdPullQuote')) {
      type = 'box';
    }

    let footnote;
    if (type === 'foot') {
      footnote = replaceall('footnote', '', $(element).attr('id'));
    }

    const figure = $(element).find('figure');

    if (figure.length && $(element).get(0).tagName === 'aside') {
      return;
    }

    await this.getImages($, figure, type);

    let text = $(element)
      .text()
      .trim();
    if (!text) {
      return;
    }

    this.items = this.items.concat(
      await this.parseResult($, element, type, footnote),
    );
  }

  public async parseResult(
    $: CheerioStatic,
    element,
    type?: string,
    footnote?: string,
  ): Promise<TextInterface[]> {
    let text = $(element).html();

    if (!text) {
      return [];
    }

    let footNoteIds: any[] = [];
    let bibles: any[] = [];

    // asterisk
    const footNotes = $(element).find('.footnoteLink');

    if (footNotes.length > 0 && this.isChinese) {
      footNotes.each((i, footNote) => {
        const footNoteId = replaceall(
          '#footnote',
          '',
          $(footNote).attr('data-anchor'),
        ).trim();

        footNoteIds.push(footNoteId);

        text = replaceall(
          $.html(footNote),
          `#FOOTNOTE${footNoteId}${$(
            footNote,
          ).html()}#ENDFOOTNOTE${footNoteId}`,
          text,
        );
      });
    }

    // bible
    bibles = $(element)
      .find('.jsBibleLink')
      .toArray();

    const bibleLinks: any[] = [];
    if (bibles.length > 0 && this.isChinese) {
      for (const bible of bibles) {
        const bibleLink = decodeURIComponent($(bible).attr('href')).split('/');
        const bibleBook = bibleLink[6];
        const bibleChapter = bibleLink[7];
        const bibleVerses: any[] = [];
        const bibleVersesLinks = bibleLink[8].split('-');

        for (const bibleVersesLink of bibleVersesLinks) {
          bibleVerses.push(parseInt(bibleVersesLink.substr(-3), 10));
        }

        bibleLinks.push({
          text: $(bible).text(),
          link: `${bibleBooks[bibleBook]}:${bibleChapter}:${bibleVerses.join(
            '-',
          )}`,
        });

        text = replaceall(
          $.html(bible),
          `BI#[${bibleBooks[bibleBook]}:${bibleChapter}:${bibleVerses.join(
            '-',
          )}]#BI${$(bible).html()}]#ENDBI`,
          text,
        );
      }
    }

    text = removeHtmlSpecialTags($, text!);

    text = replaceall('BI#[', '<bible text="', text);
    text = replaceall(']#BI', '">', text);
    text = replaceall(']#ENDBI', '</bible>', text);

    if (footNoteIds) {
      for (const footNoteId of footNoteIds) {
        text = replaceall(
          `#FOOTNOTE${footNoteId}`,
          `<footnote id="${footNoteId}">`,
          text,
        );

        text = replaceall(`#ENDFOOTNOTE${footNoteId}`, '</footnote>', text);
      }
    }

    const lines = text!
      .trim()
      .split('\r\n')
      .filter(item => item);

    const responseLines: TextInterface[] = [];
    for (const line of lines) {
      if (this.figcaptionsText.indexOf(text || '') > -1) {
        continue;
      }

      responseLines.push({
        text: line,
        bibles,
        footNoteIds,
        type,
        footnote,
      });
    }

    return responseLines;
  }

  protected async getImages($, figure, type) {
    if (!figure.length) {
      return;
    }

    let imgType;
    if (type) {
      imgType = `${type}-img`;
    } else {
      imgType = 'img';
    }

    const spanImages = $(figure).find('span');

    if (spanImages.length) {
      for (const spanImage of spanImages.toArray()) {
        const large = $(spanImage).attr('data-zoom');

        const small = $(spanImage).attr('data-img-size-lg');
        this.items.push({
          type: imgType,
          large,
          small,
        });
      }
    } else {
      for (const a of $(figure)
        .find('a')
        .toArray()) {
        const large = $(a).attr('href');
        const small = $(a)
          .find('img')
          .attr('src');

        this.items.push({
          type: imgType,
          large,
          small,
        });
      }
    }

    const figcaption = $(figure).find('figcaption');
    if (figcaption.length) {
      let imgCaption;
      if (type) {
        imgCaption = `${type}-imgcaption`;
      } else {
        imgCaption = 'imgcaption';
      }

      const result = await this.parseResult($, figcaption, imgCaption);
      for (const item of result) {
        if (item.text) {
          this.figcaptionsText.push(item.text);
        }
      }

      this.items = this.items.concat(result);
    }
  }
}
