import Vue from 'vue';
import VueMaterial from 'vue-material';

// @todo Implement autocomplete
// @todo melhorar ordenação

import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap-theme.min.css';
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

Vue.use(VueMaterial);


// Vue.use(require('src/components/directives/drag-and-drop'));

const Main = Vue.extend(App);

new Main({
  router,
  store,
}).$mount('#app');
