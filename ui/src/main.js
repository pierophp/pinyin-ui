import Vue from 'vue';

// @todo Implement autocomplete
// @todo melhorar ordenação

import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.min.css';
import 'src/css/default.css';
import 'src/css/bootstrap-callout.css';
import 'src/helpers/array';

import App from 'src/pages/App';
import router from 'src/router';
import store from 'src/data/store';

Vue.use(require('vue-drag-drop'));

const Main = Vue.extend(App);

new Main({
  router,
  store,
}).$mount('#app');
