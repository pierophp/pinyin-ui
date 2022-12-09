import { createStore } from "vuex";
import bible from "./bible";
import file from "./file";
export default () => {
  const store = createStore({
    modules: {
      FILE: file,
      // BROWSER: (await import('./browser')).default,
      BIBLE: bible,
      // VIDEO: (await import('./video')).default,
    },
  });

  return store;
};
