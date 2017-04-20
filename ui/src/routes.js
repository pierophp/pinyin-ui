import Login from 'src/pages/auth/Login';
import FilesList from 'src/pages/files/FilesList';
import FileDetails from 'src/pages/files/FileDetails';
import FilePrint from 'src/pages/files/FilePrint';
import MyCjkList from 'src/pages/my-cjk/MyCjkList';
import DictionarySearch from 'src/pages/dictionary/Search';
import DictionaryDetails from 'src/pages/dictionary/Details';
import Config from 'src/pages/config/Config';
import FileDetailsTopBar from 'src/components/files/top-bar/file-details';
import FilePrintTopBar from 'src/components/files/top-bar/file-print';
import VideoShow from 'src/pages/video/Show';

export default [
  {
    path: '/',
    name: 'login',
    component: Login,
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/files',
    name: 'files',
    component: FilesList,
  },
  {
    path: '/files/file/:filename',
    name: 'file',
    component: FileDetails,
    meta: {
      topBar: FileDetailsTopBar,
    },
  },
  {
    path: '/files/print/:filename',
    name: 'print',
    component: FilePrint,
    meta: {
      topBar: FilePrintTopBar,
    },
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: MyCjkList,
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: DictionarySearch,
  },
  {
    path: '/dictionary-details/:id',
    name: 'dictionary-details',
    component: DictionaryDetails,
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
  },
  {
    path: '/video',
    name: 'video',
    component: VideoShow,
  },
];
