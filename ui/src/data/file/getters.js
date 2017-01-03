import * as types from './types';

export default {
  [types.FILES_GETTER]({ files }) {
    return files;
  },
  [types.FILE_GETTER]({ file }) {
    return file;
  },
  [types.FILE_GETTER_MY_CJK]({ myCjk }) {
    return myCjk;
  },
  [types.FILE_GETTER_MY_CJK_TEMP]({ myCjkTemp }) {
    return myCjkTemp;
  },
};
