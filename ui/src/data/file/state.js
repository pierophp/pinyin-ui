import LocalStorage from 'src/helpers/local-storage';

let files = [];
if (LocalStorage.has('files')) {
  files = LocalStorage.get('files');
}

let myCjk = {};
if (LocalStorage.has('my-cjk')) {
  myCjk = LocalStorage.get('my-cjk');
}

export default {
  files,
  file: [],
  fileLoading: false,
  fileParsing: false,
  fileChangeTimestamp: null,
  filePasteAction: '',
  myCjk,
  myCjkTemp: '',
};
