import Vue from "vue";
import { createStore } from "vuex";

// Vue.use(Vuex);

export default async () => {
  const store = createStore({
    modules: {
      // FILE: (await import('./file')).default,
      // BROWSER: (await import('./browser')).default,
      BIBLE: (await import("./bible")).default,
      // VIDEO: (await import('./video')).default,
    },
  });

  return store;
};
