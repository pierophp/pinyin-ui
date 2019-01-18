export default [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
      redirectTo: '/#/songs',
    },
  },
  {
    path: '/login/baidu',
    name: 'login-baidu',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/songs',
    name: 'songs',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/songs/Songs'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/songs/:song',
    name: 'song',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/songs/Song'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/my-cjk',
    name: 'my-cjk',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/my-cjk/MyCjkList'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/config',
    name: 'config',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/config/Config'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/about/About'),
    meta: {},
  },
  {
    path: '*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "songs" */ 'src/pages/NotFound'),
  },
];
