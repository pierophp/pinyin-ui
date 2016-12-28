import http from 'src/helpers/http';
import clipboard01 from 'src/domain/clipboard-01';
import clipboard02 from 'src/domain/clipboard-02';
import clipboard03 from 'src/domain/clipboard-03';
import clipboard04 from 'src/domain/clipboard-04';

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
  [types.FILE_ACTION_PARSE_PASTE]({ commit, state, dispatch }, data) {
    if (data.action === '1') {
      clipboard01(data.content).forEach((row, index) => {
        const lineIndex = state.filePasteAction.lineIndex + index;
        if (index === 0) {
          commit(types.FILE_MUTATION_CONCATENATE_LINE, {
            lineIndex,
            content: row,
          });
        } else {
          commit(types.FILE_MUTATION_ADD_LINE, {
            lineIndex,
            content: row,
          });
        }
      });
    }

    if (data.action === '2') {
      clipboard02(data.content).forEach((row, index) => {
        const lineIndex = state.filePasteAction.lineIndex + index;
        if (index === 0) {
          commit(types.FILE_MUTATION_CONCATENATE_LINE, {
            lineIndex,
            content: row,
          });
        } else {
          commit(types.FILE_MUTATION_ADD_LINE, {
            lineIndex,
            content: row,
          });
        }
      });
    }

    if (data.action === '3') {
      clipboard03(data.content)
        .then((content) => {
          content.forEach((row, index) => {
            const lineIndex = state.filePasteAction.lineIndex + index;
            if (index === 0) {
              commit(types.FILE_MUTATION_CONCATENATE_LINE, {
                lineIndex,
                content: row,
              });
            } else {
              commit(types.FILE_MUTATION_ADD_LINE, {
                lineIndex,
                content: row,
              });
            }

            dispatch(types.FILE_ACTION_CONVERT_TO_PINYIN, { lineIndex });
          });
        });
    }

    if (data.action === '4') {
      clipboard04(data.content)
        .then((content) => {
          content.forEach((row, index) => {
            const lineIndex = state.filePasteAction.lineIndex + index;
            if (index === 0) {
              commit(types.FILE_MUTATION_CONCATENATE_LINE, {
                lineIndex,
                content: row,
              });
            } else {
              commit(types.FILE_MUTATION_ADD_LINE, {
                lineIndex,
                content: row,
              });
            }
            dispatch(types.FILE_ACTION_CONVERT_TO_PINYIN, { lineIndex });
          });
        });
    }
  },

  [types.FILE_ACTION_NEW_FILE]({ commit }, data) {
    http
    .post(`files/save?filename=${data.filename}.json`, {
      content: JSON.stringify({ lines: [] }),
    })
    .then(() => {
      // commit(types.FILE_MUTATION_SET, response.data.lines);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_FETCH_MY_CJK]({ commit }) {
    http
    .get('my-cjk')
    .then((response) => {
      commit(types.FILE_MUTATION_SET_MY_CJK, response.data.ideograms);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },


  [types.FILE_ACTION_ADD_MY_CJK]({ commit }, data) {
    http
    .post('my-cjk', {
      ideogram: data.myCjk,
    })
    .then(() => {
      commit(types.FILE_MUTATION_ADD_MY_CJK, data.myCjk);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

};
