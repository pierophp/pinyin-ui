import App from "../../App.vue";

import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import localeEn from "@/data/locale/en";
import localePt from "@/data/locale/pt";

import { registerPlugins } from "@/plugins";
import vuetify from "../../plugins/vuetify";
import routes from "./routes";
import { createRouter, createWebHashHistory } from "vue-router";
import store from "@/data/store";
import "@/helpers/array";
import "@/css/default.css";
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    hideTopBar?: boolean;
    topBar?: string;
    protected: boolean;
    showMenu: boolean;
    title: string;
    menu: {
      icon: string;
      title: string;
      action: string;
      link: string;
    }[];
  }
}

const locale = navigator.language.split("-")[0];

const i18n = createI18n({
  locale,
  fallbackLocale: "en",
  messages: {
    en: localeEn,
    pt: localePt,
  },
});

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const app = createApp(App);

app.use(store());
app.use(router);
app.use(i18n);

registerPlugins();

app.use(vuetify).mount("#app");
