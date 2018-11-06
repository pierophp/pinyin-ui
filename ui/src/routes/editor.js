export default [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
      redirectTo: '/#/files',
    },
  },
  {
    path: '/login/baidu',
    name: 'login-baidu',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/files',
    name: 'files',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/files/FilesList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/files/file/:filename',
    name: 'file',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/files/FileDetails'),
    meta: {
      protected: true,
      topBar: 'file-details',
    },
  },
  {
    path: '/files/print/:filename',
    name: 'print',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/files/FilePrint'),
    meta: {
      protected: true,
      topBar: 'file-print',
    },
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/my-cjk/MyCjkList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/dictionary/Search'),

    meta: {
      topBar: 'dictionary',
    },
  },
  {
    path: '/dictionary-details/:id',
    name: 'dictionary-details',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/dictionary/Details'),
    meta: {
      topBar: 'dictionary',
    },
  },
  {
    path: '/config',
    name: 'config',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/config/Config'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/video',
    name: 'video',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/video/Show'),
    meta: {
      topBar: 'videos',
      protected: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/about/About'),
    meta: {},
  },
  {
    path: '/browser',
    name: 'browser',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/browser/Browser'),
    meta: {
      topBarLeft: true,
      hideTitle: true,
      topBar: 'browser',
    },
  },
  {
    path: '*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "editor" */ 'src/pages/NotFound'),
  },
];
