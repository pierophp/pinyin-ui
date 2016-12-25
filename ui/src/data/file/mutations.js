import codeToIdeogram from 'src/helpers/code-to-ideogram';
import pinyin from 'src/helpers/pinyin';
import * as types from './types';

export default {
  [types.FILE_MUTATION_SET](state, file) {
    state.file = file;
  },

  [types.FILE_MUTATION_UPDATE_PINYIN](state, data) {
    state.file[data.lineIndex][data.blockIndex].p = pinyin(data.pinyin);
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

  [types.FILE_MUTATION_CONCATENATE_LINE](state, data) {
    data.content.forEach((newBlock) => {
      state.file[data.lineIndex].push(newBlock);
    });
  },

  [types.FILE_MUTATION_ADD_EMPTY_BLOCK](state, data) {
    if (state.file[data.lineIndex] === null) {
      state.file[data.lineIndex] = [];
    }

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

  [types.FILE_MUTATION_PASTE_ACTION](state, filePasteAction) {
    state.filePasteAction = filePasteAction;
  },

  [types.FILE_MUTATION_SET_MY_CJK](state, myCjk) {
    const myCjkIdeograms = [];
    myCjk.forEach((item) => {
      myCjkIdeograms.push(codeToIdeogram(item.ideogram));
    });

    state.myCjk = myCjkIdeograms;
  },

  [types.FILE_MUTATION_SET_MY_CJK_TEMP](state, myCjk) {
    state.myCjkTemp = myCjk;
  },

  [types.FILE_MUTATION_ADD_MY_CJK](state, myCjk) {
    state.myCjk.push(myCjk);
  },


};
