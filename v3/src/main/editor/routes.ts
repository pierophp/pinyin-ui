import { RouteRecordRaw } from "vue-router";

const appOptions = {
  // @todo chante that
  showMenu: true,
  title: "app.editor",
  menu: [
    {
      icon: "mdi-book-open",
      title: "menu.bible",
      action: "goTo",
      link: "/bible",
    },
    {
      icon: "mdi-translate",
      title: "menu.my_ideograms",
      action: "goTo",
      link: "/my-cjk",
    },
    {
      icon: "mdi-cog",
      title: "menu.settings",
      action: "goTo",
      link: "/config",
    },
    {
      icon: "mdi-help",
      title: "menu.about",
      action: "goTo",
      link: "/about",
    },
    {
      icon: "mdi-power",
      title: "menu.logout",
      action: "logout",
      link: "",
    },
    {
      icon: "mdi-autorenew",
      title: "menu.reload",
      action: "reload",
      link: "",
    },
  ],
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/auth/Login.vue"),
    meta: {
      hideTopBar: true,
      redirectTo: "/#/files",
      protected: false,
      ...appOptions,
    },
  },
  {
    path: "/login/baidu",
    name: "login-baidu",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/auth/Login.vue"),
    meta: {
      hideTopBar: true,
      protected: false,
      ...appOptions,
    },
  },
  {
    path: "/files",
    name: "files",
    component: () =>
      import(/* webpackChunkName: "files-list" */ "@/pages/files/FilesList"),
    meta: {
      protected: true,
      ...appOptions,
    },
  },

  {
    path: "/bible/save",
    name: "bible-save",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Save.vue"),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: "bible-save",
      topBarLeft: true,
      ...appOptions,
    },
  },
  {
    path: "/bible/:book",
    name: "bible-chapters",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Chapters.vue"),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: "bible-chapters",
      topBarLeft: true,
      ...appOptions,
    },
  },
  {
    path: "/bible/:book/:chapter",
    name: "bible-chapter",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Chapter.vue"),
    meta: {
      protected: true,
      hideTitle: true,
      topBar: "bible-chapter",
      topBarLeft: true,
      ...appOptions,
    },
  },
  // {
  //   path: "/my-cjk",
  //   name: "my-cjk",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/my-cjk/MyCjkList"),
  //   meta: {
  //     protected: true,
  //   },
  // },
  // {
  //   path: "/config",
  //   name: "config",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/config/Config"),
  //   meta: {
  //     protected: true,
  //   },
  // },
  // {
  //   path: "/about",
  //   name: "about",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/about/About"),
  //   meta: {},
  // },
  // {
  //   path: "*",
  //   name: "not-found",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/NotFound"),
  // },
];

export default routes;
