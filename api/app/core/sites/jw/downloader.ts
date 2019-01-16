import { http } from '../../../helpers/http';
import { profiler } from '../../../helpers/profiler';
import * as cheerio from 'cheerio';
import { Parser } from './parser';
// @ts-ignore
import * as UnihanSearch from '../../../services/UnihanSearch';
import * as bluebird from 'bluebird';
import { orderBy } from 'lodash';
import { Encoder } from '../encoder';
import { Downloader as GenericDownloader } from '../downloader';

export class Downloader {
  protected downloader: GenericDownloader;
  protected encoder: Encoder;
  protected isChinese: boolean;
  protected isTraditional: boolean;
  constructor() {
    this.downloader = new GenericDownloader();
    this.encoder = new Encoder();
  }

  public async download(
    url: string,
    language: string,
    ideogramType: string,
    convertPinyin: boolean = true,
  ) {
    if (!ideogramType) {
      ideogramType = 's';
    }

    this.verifyTypeOfSite(url, ideogramType);

    const parser = new Parser();

    const $: CheerioStatic = await this.downloadUrl(url);
    let $chinese: CheerioStatic | undefined = $;
    let $language;

    if (!this.isChinese) {
      $chinese = await this.downloadChineseByLink(
        $,
        this.isTraditional ? 't' : 's',
      );
      $language = $;
      language = String(url.replace('https://www.jw.org/', '')).split('/')[0];
    } else if (language) {
      $language = await this.downloadLanguage($, language);
    }

    if (!$chinese) {
      throw new Error('Site not found');
    }

    let $simplified;
    if (this.isTraditional) {
      $simplified = await this.downloadChineseByLink($chinese, 's');
    }

    const parsedDownload = await parser.parse($chinese, $language, $simplified);

    if (parsedDownload.links) {
      return this.parseLinks(
        parsedDownload,
        language,
        ideogramType,
        convertPinyin,
      );
    }

    // const pinyinPromise = this.pinyin(parsedDownload, convertPinyin);

    profiler('Process Language + Pinyin - Start');
    // await Promise.all([pinyinPromise]);
    profiler('Process Language + Pinyin End');

    return parsedDownload;
  }

  protected verifyTypeOfSite(url: string, ideogramType: string) {
    this.isChinese = false;

    const chineseSites = [
      'https://www.jw.org/cmn-hans',
      'https://www.jw.org/cmn-hant',
    ];

    for (const chineseSite of chineseSites) {
      if (url.substring(0, chineseSite.length) === chineseSite) {
        this.isChinese = true;
        break;
      }
    }

    this.isTraditional = false;

    if (url.indexOf('jw.org/cmn-hant') !== -1) {
      this.isTraditional = true;
    } else if (ideogramType === 't') {
      this.isTraditional = true;
    }
  }

  protected async downloadUrl(url: string): Promise<CheerioStatic> {
    let response;
    profiler(`Download JW Start - ${url}`);
    try {
      response = await this.downloader.download(this.encoder.encodeUrl(url));
    } catch (e) {
      profiler('Download on exception: ' + url);
      response = await this.downloader.download(url);
    }
    profiler('Download JW End');

    try {
      response = JSON.parse(response);
      if (response.items[0].content) {
        response = '<div id="article">' + response.items[0].content + '</div>';
      }
    } catch (e) {}

    return cheerio.load(response);
  }

  protected async downloadChineseByLink(
    $: CheerioStatic,
    ideogramType: string,
  ): Promise<CheerioStatic | undefined> {
    const chineseLink = $(`link[hreflang="cmn-han${ideogramType}"]`);
    if (chineseLink.length === 0) {
      return;
    }

    const link = `https://www.jw.org${chineseLink.attr('href')}`;
    profiler(`Download JW Start - Chinese - ${this.encoder.encodeUrl(link)}`);
    let response;
    try {
      response = await this.downloader.download(this.encoder.encodeUrl(link));
    } catch (e) {
      response = await this.downloader.download(link);
    }

    profiler('Download JW End - Chinese');

    return cheerio.load(response);
  }

  protected async downloadLanguage($: CheerioStatic, language: string) {
    const translateLink = $(`link[hreflang="${language}"]`);
    if (translateLink.length > 0) {
      const link = `https://www.jw.org${translateLink.attr('href')}`;
      profiler('Download JW (Language) Start');
      const response = await http.get(link);
      profiler('Download JW (Language) End');
      return cheerio.load(response.data);
    }
  }

  protected async parseLinks(
    parsedDownload,
    language,
    ideogramType,
    convertPinyin,
  ) {
    profiler('Getting links Start');
    const responseLinks: any = { links: [] };
    await bluebird.map(
      parsedDownload.links,
      async (l: any, i) => {
        if (!l.link) {
          return;
        }

        const jwLink = l.link.includes('https://www.jw.org')
          ? l.link
          : `https://www.jw.org${l.link}`;

        const linkResponse = await this.download(
          this.encoder.decodeUrl(jwLink),
          language,
          ideogramType,
          convertPinyin,
        );

        responseLinks.links.push({
          number: l.number,
          title: l.title,
          title_pinyin: l.title_pinyin,
          link: this.encoder.decodeUrl(jwLink),
          content: linkResponse,
        });
      },
      { concurrency: 4 },
    );

    responseLinks.links = orderBy(responseLinks.links, ['number']);

    profiler('Getting links End');

    return responseLinks;
  }

  public async pinyin(parsedDownload, convertPinyin) {
    if (!convertPinyin) {
      return;
    }
    profiler('Pinyin Start');

    await bluebird.map(
      parsedDownload.text,
      async (item: any, i) => {
        if (!item) {
          return;
        }

        if (item.type === 'img') {
          return;
        }

        if (item.type === 'box-img') {
          return;
        }

        // Converted By PDF
        if (typeof item.text !== 'string') {
          return;
        }

        if (!item.text) {
          item.text = '';
        }
        const ideograms = item.text.split(' ');
        const pinyin = await UnihanSearch.toPinyin(ideograms);
        const pinynReturn: any[] = [];
        pinyin.forEach(pinyinItem => {
          pinynReturn.push(pinyinItem.pinyin);
        });

        parsedDownload.text[i].pinyin = pinynReturn;
      },
      { concurrency: 4 },
    );

    profiler('Pinyin End');
  }
}
