import * as env from '../../../env';
import { Client } from 'elasticsearch';
import { convertUtf16ToIdeograms } from '../../services/UnihanSearch';

let client;

export class ElasticsearchProvider {
  public async createStructure() {
    const type = this.getType();
    const mappings: any = {};
    mappings[type] = {
      properties: {
        id: { type: 'integer' },
        ideogram: { type: 'text' },
        ideogramKeyword: { type: 'keyword' },
        pronunciation: { type: 'text' },
        pronunciationKeyword: { type: 'keyword' },
        pronunciationUnaccented: { type: 'text' },
        pronunciationUnaccentedKeyword: { type: 'keyword' },
        'dictionary.unihan': { type: 'text' },
        'dictionary.cedict': { type: 'text' },
        'dictionary.pt': { type: 'text' },
        'dictionary.ctPt': { type: 'text' },
        'dictionary.ctEn': { type: 'text' },
        'dictionary.ctEs': { type: 'text' },
        type: { type: 'keyword' },
        simplified: { type: 'boolean' },
        traditional: { type: 'boolean' },
        main: { type: 'integer' },
        usage: { type: 'integer' },
        frequency: { type: 'integer' },
        frequencyInverse: { type: 'integer' },
        hsk: { type: 'integer' },
        hskInverse: { type: 'integer' },
        createdAt: {
          type: 'date',
          format: 'strict_date_optional_time||epoch_millis',
        },
        updatedAt: {
          type: 'date',
          format: 'strict_date_optional_time||epoch_millis',
        },
      },
    };

    try {
      await this.getClient().indices.delete({
        index: this.getIndex(),
      });
    } catch (e) {}

    await this.getClient().indices.create({
      index: this.getIndex(),
      body: {
        mappings,
      },
    });
  }

  protected async getUpdateDocument(dictionary: any): Promise<any> {
    return {
      id: dictionary.id,
      ideogram: convertUtf16ToIdeograms(dictionary.ideogram),
      pronunciation: dictionary.pronunciation,
      pronunciationUnaccented: dictionary.pronunciation_unaccented,
      ideogramKeyword: convertUtf16ToIdeograms(dictionary.ideogram),
      pronunciationKeyword: dictionary.pronunciation,
      pronunciationUnaccentedKeyword: dictionary.pronunciation_unaccented,
      dictionary: {
        unihan: dictionary.definition_unihan,
        cedict: dictionary.definition_cedict,
        pt: dictionary.definition_pt,
        ctPt: dictionary.definition_ct_pt,
        ctEn: dictionary.definition_ct_en,
        ctEs: dictionary.definition_ct_es,
      },
      type: dictionary.type,
      simplified: dictionary.simplified ? true : false,
      traditional: dictionary.traditional ? true : false,
      main: dictionary.main ? 1 : 0,
      usage: dictionary.usage || 0,
      frequency: dictionary.frequency || 0,
      frequencyInverse:
        10 - (dictionary.frequency === 999 ? 10 : dictionary.frequency),
      hsk: dictionary.hsk === 999 ? 0 : dictionary.hsk,
      hskInverse: 10 - (dictionary.hsk === 999 ? 10 : dictionary.hsk),
      createdAt: dictionary.created_at,
      updatedAt: dictionary.updated_at,
    };
  }

  public async saveMany(dictionaryList: any[]) {
    const body: any[] = [];
    for (const dictionary of dictionaryList) {
      body.push({
        update: {
          _index: this.getIndex(),
          _type: this.getType(),
          _id: String(dictionary.id),
        },
      });

      body.push({
        doc: await this.getUpdateDocument(dictionary),
        doc_as_upsert: true,
      });
    }

    const response = await this.getClient().bulk({
      index: this.getIndex(),
      type: this.getType(),
      body,
    });

    if (response.errors) {
      for (const item of response.items) {
        console.log(item);
      }
    }
  }

  public async searchToDictionaryList(term: string) {
    const whereList = [
      {
        type: 'term',
        field: 'ideogramKeyword',
        score: '50',
      },
      {
        type: 'match_phrase',
        field: 'ideogram',
        score: '40',
      },
      {
        type: 'term',
        field: 'pronunciationKeyword',
        score: '38',
      },
      {
        type: 'match_phrase',
        field: 'pronunciation',
        score: '36',
      },
      {
        type: 'term',
        field: 'pronunciationUnaccentedKeyword',
        score: '34',
      },
      {
        type: 'match_phrase',
        field: 'pronunciationUnaccented',
        score: '32',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.pt',
        score: '20',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.ctPt',
        score: '18',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.ctEs',
        score: '16',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.cedict',
        score: '14',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.ctEn',
        score: '12',
      },
      {
        type: 'match_phrase',
        field: 'dictionary.unihan',
        score: '10',
      },
    ];

    const scoreFormulaList = [
      '(_score * $score)',
      "doc['main'].value",
      "(doc['hskInverse'].value * 3)",
      "(doc['frequencyInverse'].value * 2)",
      "(doc['usage'].value / 1000)",
    ];

    const scoreFormula = scoreFormulaList.join(' + ');

    const whereShould: any[] = [];
    const scoreFunctions: any[] = [];
    for (const where of whereList) {
      const searchContainer: any = {
        bool: {
          filter: [],
        },
      };
      const searchFilter: any = {};
      const searchCondition: any = {};
      searchCondition[where.field] = term;
      searchFilter[where.type] = searchCondition;
      searchContainer.bool.filter.push(searchFilter);
      whereShould.push(searchContainer);

      const scoreCondition: any = {};
      scoreCondition[where.field] = term;

      const scoreFilter: any = {};
      scoreFilter[where.type] = scoreCondition;

      scoreFunctions.push({
        filter: scoreFilter,
        script_score: {
          script: {
            source: scoreFormula.replace('$score', where.score),
          },
        },
      });
    }

    const query = {
      function_score: {
        query: {
          bool: {
            must: [
              { match: { _index: this.getIndex() } },
              { match: { _type: this.getType() } },
              { match: { simplified: true } },
            ],

            should: whereShould,
            minimum_should_match: 1,
          },
        },
        functions: scoreFunctions,
      },
    };

    // console.log(JSON.stringify(query, null, 2));

    const response = await this.getClient().search({
      body: { query },
    });

    // return response.hits;

    return {
      entries: response.hits.hits.map((item: any) => {
        return {
          id: item._source.id,
          pronunciation: item._source.pronunciation,
          ideogram: item._source.ideogram,
        };
      }),
      search: term,
    };
  }

  protected getIndex(): string {
    return 'pinyin';
  }

  protected getType(): string {
    return 'dictionary';
  }

  protected getClient(): Client {
    if (client) {
      return client;
    }

    client = new Client({
      host: `${env.elasticsearch_host}:${env.elasticsearch_port}`,
      // log: 'trace',
    });

    return client;
  }
}
