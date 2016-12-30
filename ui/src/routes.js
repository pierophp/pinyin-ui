import Login from 'src/pages/auth/Login';
import FilesList from 'src/pages/files/FilesList';
import FileDetails from 'src/pages/files/FileDetails';
import FilePrint from 'src/pages/files/FilePrint';
import FileTest from 'src/pages/files/FileTest';
import MyCjkList from 'src/pages/my-cjk/MyCjkList';
import FileDetailsTopBar from 'src/components/files/FileDetailsTopBar';

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
  },
  {
    path: '/file/test',
    name: 'files-test',
    component: FileTest,
  },
  {
    path: '/files/file/:filename',
    name: 'file',
    component: FileDetails,
    meta: { topBar: FileDetailsTopBar },
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
