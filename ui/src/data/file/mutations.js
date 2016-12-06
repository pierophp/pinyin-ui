import pinyinize from 'pinyinize';
import * as types from './types';


export default {
  [types.FILE_MUTATION_SET](state, file) {
    state.file = file;
  },

  [types.FILE_MUTATION_UPDATE_PINYIN](state, data) {
    state.file[data.lineIndex][data.blockIndex].p = pinyinize(data.pinyin);
  },

  [types.FILE_MUTATION_UPDATE_CHARACTER](state, data) {
    state.file[data.lineIndex][data.blockIndex].c = data.character;
  },

  [types.FILE_MUTATION_ADD_EMPTY_LINE](state) {
    if (state.file === undefined) {
      state.file = [];
    }

    state.file.push([]);
  },

  [types.FILE_MUTATION_ADD_EMPTY_BLOCK](state, data) {
    state.file[data.lineIndex].push({
      p: '',
      c: '',
    });
  },

  [types.FILE_MUTATION_REMOVE_LINE](state, data) {
    state.file.remove(data.lineIndex);
  },

  [types.FILE_MUTATION_REMOVE_BLOCK](state, data) {
    state.file[data.lineIndex].remove(data.blockIndex);
  },
};
