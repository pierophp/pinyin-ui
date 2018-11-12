export default [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "login" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
      redirectTo: '/#/files',
    },
  },
  {
    path: '/login/baidu',
    name: 'login-baidu',
    component: () =>
      import(/* webpackChunkName: "login" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/files',
    name: 'files',
    component: () =>
      import(/* webpackChunkName: "files-list" */ 'src/pages/files/FilesList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/files/file/:filename',
    name: 'file',
    component: () =>
      import(/* webpackChunkName: "files-details" */ 'src/pages/files/FileDetails'),
    meta: {
      protected: true,
      topBar: 'file-details',
    },
  },
  {
    path: '/files/print/:filename',
    name: 'print',
    component: () =>
      import(/* webpackChunkName: "files-print" */ 'src/pages/files/FilePrint'),
    meta: {
      protected: true,
      topBar: 'file-print',
    },
  },
  {
    path: '/files/quiz/:filename',
    name: 'quiz',
    component: () =>
      import(/* webpackChunkName: "files-quiz" */ 'src/pages/files/FileQuiz'),
    meta: {
      protected: true,
      topBar: 'file-quiz',
    },
  },
  {
    path: '/files/quiz-answer/:filename',
    name: 'quiz',
    component: () =>
      import(/* webpackChunkName: "files-quiz" */ 'src/pages/files/FileQuizAnswer'),
    meta: {
      protected: true,
      topBar: 'file-quiz-answer',
    },
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: () =>
      import(/* webpackChunkName: "my-cjk" */ 'src/pages/my-cjk/MyCjkList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/dictionary',
    name: 'dictionary',
    component: () =>
      import(/* webpackChunkName: "dictionary" */ 'src/pages/dictionary/Search'),

    meta: {
      topBar: 'dictionary',
    },
  },
  {
    path: '/dictionary-details/:id',
    name: 'dictionary-details',
    component: () =>
      import(/* webpackChunkName: "dictionary" */ 'src/pages/dictionary/Details'),
    meta: {
      topBar: 'dictionary',
    },
  },
  {
    path: '/config',
    name: 'config',
    component: () =>
      import(/* webpackChunkName: "config" */ 'src/pages/config/Config'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/video',
    name: 'video',
    component: () =>
      import(/* webpackChunkName: "video" */ 'src/pages/video/Show'),
    meta: {
      topBar: 'videos',
      protected: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "about" */ 'src/pages/about/About'),
    meta: {},
  },
  {
    path: '/browser',
    name: 'browser',
    component: () =>
      import(/* webpackChunkName: "browser" */ 'src/pages/browser/Browser'),
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
