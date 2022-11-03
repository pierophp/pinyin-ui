export default [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
      redirectTo: '/#/bible',
    },
  },
  {
    path: '/login/baidu',
    name: 'login-baidu',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/bible',
    name: 'bible',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/bible/Books'),
    meta: {
      protected: true,
      topBar: 'bible-books',
    },
  },

  {
    path: '/bible/save',
    name: 'bible-save',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/bible/Save'),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: 'bible-save',
      topBarLeft: true,
    },
  },
  {
    path: '/bible/:book',
    name: 'bible-chapters',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/bible/Chapters'),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: 'bible-chapters',
      topBarLeft: true,
    },
  },
  {
    path: '/bible/:book/:chapter',
    name: 'bible-chapter',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/bible/Chapter'),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: 'bible-chapter',
      topBarLeft: true,
    },
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/my-cjk/MyCjkList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/config',
    name: 'config',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/config/Config'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/about/About'),
    meta: {},
  },
  {
    path: '*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "bible" */ 'src/pages/NotFound'),
  },
];
