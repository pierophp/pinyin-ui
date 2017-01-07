import LocalStorage from 'src/helpers/local-storage';

let files = [];
if (LocalStorage.has('files')) {
  files = LocalStorage.get('files');
}

let myCjk = [];
if (LocalStorage.has('my_cjk')) {
  myCjk = LocalStorage.get('my_cjk');
}

export default {
  files,
  file: {},
  fileChangeTimestamp: null,
  filePasteAction: '',
  myCjk,
  myCjkTemp: '',
};
