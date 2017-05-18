import offlinePlugin from 'offline-plugin/runtime';
import Vue from 'vue';
import VueMaterial from 'vue-material';
import VueI18n from 'vue-i18n';
import VueAnalytics from 'vue-analytics';

// @todo Implement autocomplete
// @todo melhorar ordenação

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.min.css';
import 'vue-material/dist/vue-material.css';
import 'src/css/default.css';
import 'src/css/bootstrap-callout.css';
import 'src/helpers/array';
import 'medium-editor/dist/css/medium-editor.css';
import 'medium-editor/dist/css/themes/default.css';

import App from 'src/pages/App';
import router from 'src/router';
import store from 'src/data/store';
import localeEn from 'src/data/locale/en';
import localePt from 'src/data/locale/pt';

Vue.use(VueI18n);
Vue.use(VueMaterial);

Vue.locale('en', localeEn);
Vue.locale('pt', localePt);

Vue.config.lang = navigator.language.split('-')[0];
Vue.config.fallbackLang = 'en';

if (process.env === 'production') {
  offlinePlugin.install({
    onUpdateReady: () => {
      // Tells to new SW to take control immediately
      offlinePlugin.applyUpdate();
    },
    onUpdated: () => {
      // Reload the webpage to load into the new version
      window.location.reload();
    },
  });

  Vue.use(VueAnalytics, {
    id: 'UA-4081205-4',
    router,
  });
}


// Vue.use(require('src/components/directives/drag-and-drop'));

const Main = Vue.extend(App);

new Main({
  router,
  store,
}).$mount('#app');
