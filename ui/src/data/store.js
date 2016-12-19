import Vue from 'vue';
import Vuex from 'vuex';

import FILE from './file';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    FILE,
  },
});

export default store;
