import * as types from "./types";

export default {
  [types.FILES_GETTER]({ files }: any) {
    return files;
  },
  [types.FILE_GETTER]({ file }: any) {
    return file;
  },
  [types.FILE_GETTER_LOADING]({ fileLoading }: any) {
    return fileLoading;
  },
  [types.FILE_GETTER_PARSING]({ fileParsing }: any) {
    return fileParsing;
  },
  [types.FILE_GETTER_IMPORTING]({ fileImporting }: any) {
    return fileImporting;
  },
  [types.FILE_GETTER_MY_CJK]({ myCjk }: any) {
    return myCjk;
  },
  [types.FILE_GETTER_MY_CJK_TEMP]({ myCjkTemp }: any) {
    return myCjkTemp;
  },
  [types.FILE_GETTER_FOOTNOTES]({ footnotes }: any) {
    return footnotes;
  },
  [types.FILE_GETTER_FULL_FILE]({ fullFileString }: any) {
    return JSON.parse(fullFileString);
  },
  [types.FILE_GETTER_FULL_FILE_TOTAL_PAGES]({ fullFileString, perPage }: any) {
    const fullFile = JSON.parse(fullFileString);
    return Math.ceil(fullFile.length / perPage);
  },

  [types.FILE_GETTER_CURRENT_PAGE]({ currentPage }: any) {
    return currentPage;
  },

  [types.FILE_GETTER_SELECTEDS]({ fileSelecteds }: any) {
    return fileSelecteds;
  },
};
