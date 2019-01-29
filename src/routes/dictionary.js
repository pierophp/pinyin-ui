export default [
  {
    path: '/',
    name: 'dictionary-home',
    component: () =>
      import(/* webpackChunkName: "dictionary" */ 'src/pages/dictionary/Search'),
    meta: {
      topBar: 'dictionary',
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
    path: '*',
    name: 'not-found',
    component: () =>
      import(/* webpackChunkName: "dictionary" */ 'src/pages/NotFound'),
  },
];
