import http from 'src/helpers/http';
import * as types from './types';

export default {
  [types.FILE_ACTION_FETCH]({ commit }, filename) {
    http
    .get('files/file', {
      params: {
        filename,
      },
    })
    .then((response) => {
      commit(types.FILE_MUTATION_SET, response.data.lines);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_SAVE]({ commit }, data) {
    http
    .post(`files/save?filename=${data.filename}`, {
      content: JSON.stringify({ lines: data.content }),
    })
    .then(() => {
      // commit(types.FILE_MUTATION_SET, response.data.lines);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_CONVERT_TO_PINYIN]({ commit, state }, data) {
    state.file[data.lineIndex].forEach((block, blockIndex) => {
      http
          .get('unihan/to_pinyin', {
            params: {
              ideograms: block.c,
            },
          })
          .then((response) => {
            commit(types.FILE_MUTATION_UPDATE_PINYIN, {
              lineIndex: data.lineIndex,
              blockIndex,
              pinyin: response.data.pinyin,
            });
          })
          .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
    });

  /*
  let blockIndex = -1;
    for (const block of ) {
      (function convertToPinyin() {
        blockIndex += 1;
        const scopedBlockIndex = blockIndex;

      }());
    }
  */
  },
};
