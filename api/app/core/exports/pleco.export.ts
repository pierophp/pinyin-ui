import { exec } from 'child_process';
import { remove as removeDiacritics } from 'diacritics';
import { writeFile } from 'fs-extra';

import * as separatePinyinInSyllables from '../../../../shared/helpers/separate-pinyin-in-syllables';
import * as env from '../../../env';
import * as extractPinyinTone from '../../helpers/extract-pinyin-tone';
import { CjkRepository } from '../../repository/cjk.repository';
import { IdeogramsConverter } from '../converter/ideograms.converter';

export class PlecoExport {
  async exportPt() {
    const result = await CjkRepository.findPtNotNull();
    await this.export(result, 'definition_pt', 'PlecoDictionary.txt');
  }

  async exportChineseToolsPt() {
    const result = await CjkRepository.findChineseToolsNotNull('pt');
    await this.export(
      result,
      'definition_ct_pt',
      'PlecoDictionary_ChineseToolsPT.txt',
    );
  }

  async exportChineseToolsEs() {
    const result = await CjkRepository.findChineseToolsNotNull('es');
    await this.export(
      result,
      'definition_ct_es',
      'PlecoDictionary_ChineseToolsES.txt',
    );
  }

  async exportChineseToolsEn() {
    const result = await CjkRepository.findChineseToolsNotNull('en');
    await this.export(
      result,
      'definition_ct_en',
      'PlecoDictionary_ChineseToolsEN.txt',
    );
  }

  async exportGlosbePt() {
    const result = await CjkRepository.findGlosbeNotNull('pt');
    await this.export(
      result,
      'definition_glosbe_pt',
      'PlecoDictionary_GlosbePT.txt',
    );
  }

  async exportGlosbeEs() {
    const result = await CjkRepository.findGlosbeNotNull('es');
    await this.export(
      result,
      'definition_glosbe_es',
      'PlecoDictionary_GlosbeES.txt',
    );
  }

  async exportGlosbeEn() {
    const result = await CjkRepository.findGlosbeNotNull('en');
    await this.export(
      result,
      'definition_glosbe_en',
      'PlecoDictionary_GlosbeEN.txt',
    );
  }

  async export(result: any[], field: string, filename: string) {
    let dirname = `${__dirname}/../../../storage/`;
    if (env.storage_path) {
      dirname = `${env.storage_path}/`;
    }

    const ideogramsConverter = new IdeogramsConverter();

    let resultFile: string = '';

    for (const entry of result) {
      let definition = JSON.parse(entry[field]);

      if (!definition || definition.length === 0) {
        continue;
      }

      definition = definition.join(String.fromCharCode(60081));
      const pinyin = separatePinyinInSyllables(entry.pronunciation);
      let pinyinTones = '';
      pinyin.forEach(syllable => {
        let tone = extractPinyinTone(syllable);
        if (tone === 0) {
          tone = 5;
        }
        pinyinTones += `${removeDiacritics(syllable)}${tone}`;
      });

      let variants: any[] = [];

      const ideograms: string = ideogramsConverter.convertUtf16ToIdeograms(
        entry.ideogram,
      );

      if (entry.variants) {
        variants = JSON.parse(entry.variants);
      } else {
        variants = [
          await ideogramsConverter.simplifiedToTraditional(ideograms),
        ];
      }

      const line = `${ideograms}[${variants.join(
        '/',
      )}]\t${pinyinTones}\t${definition}\n`;
      resultFile += line;
    }

    resultFile = resultFile.trim();

    const filenamePleco = `${dirname}${filename}`;

    await writeFile(filenamePleco, resultFile);
  }
}
