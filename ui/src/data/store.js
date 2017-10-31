import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default async () => {
  const store = new Vuex.Store({
    modules: {
      FILE: (await import('./file')).default,
    },
  });

  return store;
};
