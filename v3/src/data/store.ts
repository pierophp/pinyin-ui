import Vue from "vue";
import { createStore } from "vuex";
import bible from "./bible";

// Vue.use(Vuex);

export default () => {
  const store = createStore({
    modules: {
      // FILE: (await import('./file')).default,
      // BROWSER: (await import('./browser')).default,
      BIBLE: bible,
      // VIDEO: (await import('./video')).default,
    },
  });

  return store;
};
