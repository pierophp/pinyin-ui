/* eslint-disable */

import offlinePlugin from 'offline-plugin/runtime';
import Vue from 'vue';
import VueI18n from 'vue-i18n';

import VueAnalytics from 'vue-analytics';
import VueClipboard from 'v-clipboard';

import 'font-awesome/css/font-awesome.min.css';
import 'src/css/vue-material/vue-material.min.css';
import 'src/css/vue-material/default.css';

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

import vueMaterialLoader from './vue.material.loader';
import ravenLoader from './raven.loader';

export default async function loadMain(moduleName) {
  if (['bible', 'editor', 'videos'].includes(moduleName)) {
    const FileContainer = (await import(/* webpackChunkName: "file-container" */ 'src/components/files/FileContainer'))
      .default;
    Vue.component('file-container', FileContainer);
  }

  const routerMethod = (await import('src/router')).default;

  const routes = (await import(`src/routes/${moduleName}`)).default;

  const router = routerMethod(
    routes,
    (await import(`src/app/${moduleName}`)).default,
  );

  vueMaterialLoader(Vue);
  ravenLoader(Vue).then();

  Vue.use(VueI18n);
  Vue.use(VueClipboard);

  Vue.locale('en', localeEn);
  Vue.locale('pt', localePt);

  Vue.config.lang = navigator.language.split('-')[0];
  Vue.config.fallbackLang = 'en';

  if (process.env.NODE_ENV === 'production') {
    offlinePlugin.install({
      onUpdateReady() {
        // Tells to new SW to take control immediately
        offlinePlugin.applyUpdate();
      },
      onUpdated() {
        // Reload the webpage to load into the new version
        // window.location.reload();
      },
    });

    Vue.use(VueAnalytics, {
      id: 'UA-4081205-4',
      router,
    });
  }

  const Main = Vue.extend(App);

  new Main({
    router,
    store: await store(),
  }).$mount('#app');
}
