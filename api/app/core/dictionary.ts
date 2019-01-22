//@ts-ignore
import * as UnihanSearch from '../services/UnihanSearch';
import { ElasticsearchProvider } from './search/elasticsearch.provider';
import * as env from '../../env';
export class Dictionary {
  public async search(term: string, debug: boolean) {
    if (env.elasticsearch_host) {
      const searchManager = new ElasticsearchProvider();
      return await searchManager.searchToDictionaryList(term, debug);
    }

    return await UnihanSearch.searchToDictionaryList(term);
  }
}
