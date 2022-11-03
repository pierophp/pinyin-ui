import LocalStorage from 'src/helpers/local-storage';

let myCjk = {};
if (LocalStorage.has('my-cjk')) {
  myCjk = LocalStorage.get('my-cjk');
}

export default {
  files: [],
  file: [],
  fileSelecteds: {},
  fullFile: undefined, // not reactive
  fullFileString: '[]',
  footnotes: [],
  fileLoading: false,
  fileParsing: false,
  fileImporting: false,
  fileChangeTimestamp: null,
  filePasteAction: '',
  myCjk,
  myCjkTemp: '',
  perPage: 25 * 6,
  currentPage: 1,
};
