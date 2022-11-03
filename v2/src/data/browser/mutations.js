import LocalStorage from 'src/helpers/local-storage';
import * as types from './types';

export default {
  [types.BROWSER_MUTATION_SET_URL](state, url) {
    LocalStorage.save('browser-url', url);
    state.url = url;
  },
};
