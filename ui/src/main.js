import Vue from 'vue';

// @todo Implement row ordenation
// @todo Implement print
// @todo Implement new file
// @todo Fix autofocus file paste
// @todo Implement loader on login
// @todo Implement logout

import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-social/bootstrap-social.css';
import 'font-awesome/css/font-awesome.min.css';
import 'src/css/default.css';
import 'src/css/bootstrap-callout.css';
import 'src/helpers/array';

import App from 'src/pages/App';
import router from 'src/router';
import store from 'src/data/store';

const Main = Vue.extend(App);

new Main({
  router,
  store,
}).$mount('#app');
