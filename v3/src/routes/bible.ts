import { RouteRecordRaw } from "vue-router";

const appOptions = {
  // @todo chante that
  showMenu: true,
  title: "app.bible",
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
  // {
  //   path: "/",
  //   name: "login",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/auth/Login"),
  //   meta: {
  //     hideTopBar: true,
  //     redirectTo: "/#/bible",
  //   },
  // },
  // {
  //   path: "/login/baidu",
  //   name: "login-baidu",
  //   component: () =>
  //     import(/* webpackChunkName: "bible" */ "src/pages/auth/Login"),
  //   meta: {
  //     hideTopBar: true,
  //   },
  // },
  // @todo remove thatr after login
  {
    path: "/",
    name: "login",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Books"),
    meta: {
      protected: true,
      topBar: "bible-books",
      ...appOptions,
    },
  },
  {
    path: "/bible",
    name: "bible",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Books"),
    meta: {
      protected: true,
      topBar: "bible-books",
      ...appOptions,
    },
  },

  {
    path: "/bible/save",
    name: "bible-save",
    component: () =>
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Save"),
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
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Chapters"),
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
      import(/* webpackChunkName: "bible" */ "@/pages/bible/Chapter"),
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
