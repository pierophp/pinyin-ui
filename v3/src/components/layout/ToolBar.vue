<template>
  <div>
    <v-navigation-drawer v-model="showNavigation" fixed temporary app>
      <v-list dense>
        <v-list color="primary">
          <v-list-item>
            <template v-slot:prepend>
              <v-icon icon="mdi-clock"></v-icon>
            </template>

            <v-list-item-title class="title">Teste</v-list-item-title>
            <v-list-item-subtitle>Teste</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="showNavigation = !showNavigation"
      ></v-app-bar-nav-icon>

      <v-toolbar-title>My files</v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn variant="text" icon="mdi-magnify"></v-btn>

      <v-btn variant="text" icon="mdi-filter"></v-btn>

      <v-btn variant="text" icon="mdi-dots-vertical"></v-btn>
    </v-app-bar>

    <!-- <v-navigation-drawer v-model="showNavigation" fixed temporary app>
      <v-list dense>
        <v-list color="primary">
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="title">{{
                user.name
              }}</v-list-item-title>
              <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>

        <v-list color="primary">
          <v-list-item
            @click="doAction(menuItem.action, menuItem.link)"
            v-for="(menuItem, menuItemId) in menu"
            v-bind:key="menuItemId"
          >
            <v-list-item-icon>
              <v-icon v-text="menuItem.icon"></v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{ $t(menuItem.title) }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar color="indigo" dark>
      <v-app-bar-nav-icon
        v-if="!hideTopBar && showMenu"
        @click.stop="showNavigation = !showNavigation"
      ></v-app-bar-nav-icon>

      <v-toolbar-title v-if="!hideTitle">{{
        $t($router.options.appOptions.title)
      }}</v-toolbar-title>
      <v-spacer></v-spacer>

      <dynamic :options="topBar" />
    </v-toolbar> -->
  </div>
</template>
<script lang="ts">
// import Dynamic from "@/components/layout/Dynamic";
import User from "@/domain/user";
import { useRoute } from "vue-router";

export default {
  components: {
    // Dynamic,
  },
  props: {
    showMenu: { type: Boolean, value: true },
  },

  watch: {
    $route() {
      this.topBar = this.$route.meta.topBar;
      this.hideTopBar = this.$route.meta.hideTopBar;
      this.hideTitle = this.$route.meta.hideTitle;
    },
  },
  created() {
    document.title = this.$t(this.$route.meta.title);
  },
  data() {
    return {
      showNavigation: false,
      topBar: this.$route.meta.topBar,
      hideTopBar: this.$route.meta.hideTopBar,
      hideTitle: this.$route.meta.hideTitle,
      user: User.getUser(),
      menu: this.$route.meta.menu,
    };
  },
  methods: {
    doAction(action, param) {
      if (action === "goTo") {
        this.goTo(param);
      } else if (action === "logout") {
        this.logout();
      } else if (action === "reload") {
        window.location.reload(true);
      }
    },
    goTo(link) {
      this.showNavigation = false;
      this.$router.push(link);
    },
    logout() {
      User.logout();
    },
  },
};
</script>
<style>
.md-drawer {
  width: 240px !important;
}
</style>
