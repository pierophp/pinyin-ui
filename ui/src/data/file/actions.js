import http from 'src/helpers/http';
import clipboard01 from 'src/domain/clipboard-01';
import clipboard02 from 'src/domain/clipboard-02';
import clipboard03 from 'src/domain/clipboard-03';
import clipboard04 from 'src/domain/clipboard-04';
import LocalStorage from 'src/helpers/local-storage';

import * as types from './types';

export default {
  [types.FILE_ACTION_FETCH]({ commit }, filename) {
    const fileKey = `file_${filename}`;
    if (LocalStorage.has(fileKey)) {
      commit(types.FILE_MUTATION_SET, LocalStorage.get(fileKey));
    }

    http
    .get('files/file', {
      params: {
        filename: `${filename}.json`,
      },
    })
    .then((response) => {
      LocalStorage.save(fileKey, response.data.lines);
      commit(types.FILE_MUTATION_SET, response.data.lines);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILES_ACTION_FETCH]({ commit }) {
    http
    .get('files')
    .then((response) => {
      LocalStorage.save('files', response.data);
      commit(types.FILES_MUTATION_SET, response.data);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_SAVE]({ commit, state }, data) {
    if (state.fileChangeTimestamp === null) {
      return;
    }

    const fileKey = `file_${data.filename}`;

    (function () {
      const fileChangeTimestamp = state.fileChangeTimestamp;
      LocalStorage.save(fileKey, data.content);
      http
      .post(`files/save?filename=${data.filename}.json`, {
        content: JSON.stringify({ lines: data.content }),
      })
      .then(() => {
        if (state.fileChangeTimestamp === fileChangeTimestamp) {
          state.fileChangeTimestamp = null;
        }
      })
      .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
    }());
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

  [types.FILE_ACTION_NEW_FILE]({ commit, state }, data) {
    http
    .post(`files/save?filename=${data.filename}.json`, {
      content: JSON.stringify({ lines: [] }),
    })
    .then(() => {
      state.files.push(data.filename);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_DELETE_FILE]({ commit, state }, data) {
    http
    .delete(`files?filename=${data.filename}.json`)
    .then(() => {
      state.files.splice(state.files.indexOf(data.filename), 1);
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

  [types.FILE_ACTION_REMOVE_MY_CJK]({ commit }, data) {
    http
    .delete('my-cjk', {
      data: {
        ideogram: data.myCjk,
      },
    })
    .then(() => {
      commit(types.FILE_MUTATION_REMOVE_MY_CJK, data.myCjk);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

};
