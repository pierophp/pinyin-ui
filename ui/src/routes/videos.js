export default [
  {
    path: '/',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
      redirectTo: '/#/video',
    },
  },
  {
    path: '/login/baidu',
    name: 'login-baidu',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/auth/Login'),
    meta: {
      hideTopBar: true,
    },
  },
  {
    path: '/video',
    name: 'video',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/video/Show'),
    meta: {
      topBar: 'videos',
      protected: true,
    },
  },
  {
    path: '/config',
    name: 'config',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/config/Config'),
    meta: {
      protected: true,
    },
  },
  {
    path: '/about',
    name: 'about',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/about/About'),
    meta: {},
  },
  {
    path: '*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "videos" */ 'src/pages/NotFound'),
  },
];
