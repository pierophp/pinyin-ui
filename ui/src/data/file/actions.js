import http from 'src/helpers/http';
import clipboard01 from 'src/domain/clipboard-01';
import clipboard02 from 'src/domain/clipboard-02';

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
  },
  [types.FILE_ACTION_PARSE_PASTE]({ commit, state }, data) {
    if (state.filePasteAction.action === 1) {
      commit(types.FILE_MUTATION_CONCATENATE_LINE, {
        lineIndex: state.filePasteAction.lineIndex,
        content: clipboard01(data),
      });
    }

    if (state.filePasteAction.action === 2) {
      commit(types.FILE_MUTATION_CONCATENATE_LINE, {
        lineIndex: state.filePasteAction.lineIndex,
        content: clipboard02(data),
      });
    }
  },

  [types.FILE_ACTION_NEW_FILE]({ commit, state }, data) {
    http
    .post(`files/save?filename=${data.filename}.json`, {
      content: JSON.stringify({ lines: [] }),
    })
    .then(() => {
      // commit(types.FILE_MUTATION_SET, response.data.lines);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

};
