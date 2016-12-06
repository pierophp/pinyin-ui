import Login from 'src/pages/auth/Login';
import FilesList from 'src/pages/files/FilesList';
import FileDetails from 'src/pages/files/FileDetails';
import FilesPrint from 'src/pages/files/Print';

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
    path: '/files/file/:file',
    name: 'file',
    component: FileDetails,
  },
  {
    path: '/files/print/:filename',
    name: 'home',
    component: FilesPrint,
  },
];
