/* eslint-disable */

// import offlinePlugin from 'offline-plugin/runtime';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import vuetify from './plugins/vuetify';

import VueAnalytics from 'vue-analytics';
import VueClipboard from 'v-clipboard';

import 'font-awesome/css/font-awesome.min.css';
import 'src/css/vue-material/vue-material.min.css';
import 'src/css/vue-material/default.css';

import 'vuetify/dist/vuetify.min.css';
import 'src/css/default.css';
import 'src/css/bootstrap-callout.css';
import 'src/css/fonts/material-icons.css';
import 'src/css/fonts/roboto.css';
import 'src/css/fonts/noto-sans-sc.css';
import 'src/css/fonts/noto-sans-tc.css';
import 'src/helpers/array';

import App from 'src/pages/App';
import store from 'src/data/store';
import localeEn from 'src/data/locale/en';
import localePt from 'src/data/locale/pt';
import ravenLoader from './raven.loader';
import PortalVue from 'portal-vue';
import './register.service.worker';

export default async function loadMain(routes, app, globalLoader) {
  const routerMethod = (
    await import(/* webpackChunkName: "router" */ 'src/router')
  ).default;

  const router = routerMethod(routes, app);

  globalLoader(Vue);
  ravenLoader(Vue).then();

  Vue.use(VueClipboard);

  if (process.env.NODE_ENV === 'production') {
    Vue.use(VueAnalytics, {
      id: 'UA-4081205-4',
      router,
    });
  }

  Vue.use(VueI18n);
  Vue.use(PortalVue);

  const Main = Vue.extend(App);

  const locale = navigator.language.split('-')[0];

  Vue.prototype.$locale = locale;

  const i18n = new VueI18n({
    locale,
    fallbackLocale: 'en',
    messages: {
      en: localeEn,
      pt: localePt,
    },
  });

  new Main({
    i18n,
    router,
    vuetify,
    store: await store(),
  }).$mount('#app');
}
