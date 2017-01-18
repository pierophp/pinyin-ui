import Vue from 'vue';
import http from 'src/helpers/http';
import clipboard01 from 'src/domain/clipboard-01';
import clipboard02 from 'src/domain/clipboard-02';
import clipboard03 from 'src/domain/clipboard-03';
import clipboard04 from 'src/domain/clipboard-04';
import LocalStorage from 'src/helpers/local-storage';
import codeToIdeogram from 'src/helpers/code-to-ideogram';

import * as types from './types';


function loadFile(file, lineIndex, state, commit, storage, filename) {
  if (file.length === lineIndex) {
    if (state.file.length > file.length) {
      state.file.splice(file.length, state.file.length - file.length);
    }
    commit(types.FILE_MUTATION_SET_FILE_LOADING, false);
    if (storage) {
      http
      .get('files/file', {
        params: {
          filename: `${filename}.json`,
        },
      })
      .then((response) => {
        commit(types.FILE_MUTATION_SET_FILE_LOADING, true);
        // state.fileLoading = true;
        const fileKey = `file_${filename}`;
        LocalStorage.save(fileKey, response.data.lines);
        loadFile(LocalStorage.get(fileKey), 0, state, commit, false, filename);
      })
      .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
    }
    return;
  }

  const line = file[lineIndex];

  commit(types.FILE_MUTATION_SET_LINE, {
    line,
    lineIndex,
  });
  lineIndex += 1;
  if (storage) {
    Vue.nextTick(() => {
      setTimeout(() => {
        loadFile(file, lineIndex, state, commit, storage, filename);
      }, 30);
    });
  } else {
    loadFile(file, lineIndex, state, commit, storage, filename);
  }
}

export default {
  [types.FILE_ACTION_FETCH]({ commit, state }, filename) {
    const fileKey = `file_${filename}`;
    let lines = [];
    if (LocalStorage.has(fileKey)) {
      lines = LocalStorage.get(fileKey);
    }

    commit(types.FILE_MUTATION_SET_FILE_LOADING, true);
    Vue.nextTick(() => {
      commit(types.FILE_MUTATION_SET, { file: [] });
      loadFile(lines, 0, state, commit, true, filename);
    });
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

    // Disable auto save on file is loading
    if (state.fileLoading) {
      return;
    }

    const fileKey = `file_${data.filename}`;

    (function actionSave() {
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
    const ideograms = [];
    state.file[data.lineIndex].forEach((block) => {
      ideograms.push(block.c);
    });

    http
      .post('unihan/to_pinyin', {
        ideograms,
      })
      .then((response) => {
        response.data.forEach((item, blockIndex) => {
          commit(types.FILE_MUTATION_UPDATE_PINYIN, {
            lineIndex: data.lineIndex,
            blockIndex,
            pinyin: item.pinyin,
          });
        });
      })
      .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
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
    const fileKey = `file_${data.filename}`;

    http
    .delete(`files?filename=${data.filename}.json`)
    .then(() => {
      LocalStorage.remove(fileKey);
      state.files.splice(state.files.indexOf(data.filename), 1);
    })
    .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
  },

  [types.FILE_ACTION_FETCH_MY_CJK]({ commit }) {
    setTimeout(() => {
      http
      .get('my-cjk')
      .then((response) => {
        const myCjkIdeograms = [];
        response.data.ideograms.forEach((item) => {
          myCjkIdeograms.push(codeToIdeogram(item.ideogram));
        });
        LocalStorage.save('my-cjk', myCjkIdeograms);
        commit(types.FILE_MUTATION_SET_MY_CJK, myCjkIdeograms);
      })
      .catch((error) => commit(types.FILE_MUTATION_FAILURE, error));
    }, 5000);
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
