import Login from 'src/pages/auth/Login';
import FilesList from 'src/pages/files/FilesList';
import FileDetails from 'src/pages/files/FileDetails';
import FilePrint from 'src/pages/files/FilePrint';
import MyCjkList from 'src/pages/my-cjk/MyCjkList';
// import FileDetailsTopBar from 'src/components/files/FileDetailsTopBar';

export default [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/files',
    name: 'files',
    component: FilesList,
    meta: { topBar: '<div>Lastname: {{name}}</div>' },
  },
  {
    path: '/files/file/:filename',
    name: 'file',
    component: FileDetails,
    meta: {
      topBar: '<div><md-button class="md-icon-button"><md-icon>offline_pin</md-icon></md-button><md-button class="md-icon-button"><md-icon>print</md-icon></md-button></div>',
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
];
