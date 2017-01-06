import Login from 'src/pages/auth/Login';
import FilesList from 'src/pages/files/FilesList';
import FileDetails from 'src/pages/files/FileDetails';
import FilePrint from 'src/pages/files/FilePrint';
import MyCjkList from 'src/pages/my-cjk/MyCjkList';
import Config from 'src/pages/config/Config';
// import FileDetailsTopBar from 'src/components/files/FileDetailsTopBar';

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
      topBar: '<div><md-button class="md-icon-button"><md-icon>print</md-icon></md-button></div>',
    },
  },
  {
    path: '/files/print/:filename',
    name: 'print',
    component: FilePrint,
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: MyCjkList,
  },
  {
    path: '/config',
    name: 'config',
    component: Config,
  },
];
