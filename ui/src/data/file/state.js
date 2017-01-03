import LocalStorage from 'src/helpers/local-storage';

let files = [];
if (LocalStorage.has('files')) {
  files = LocalStorage.get('files');
}

export default {
  files,
  file: {},
  fileChangeTimestamp: null,
  filePasteAction: '',
  myCjk: [],
  myCjkTemp: '',
};
