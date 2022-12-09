<template>
  <v-navigation-drawer v-model="showNavigation" fixed temporary app>
    <v-list dense>
      <v-list color="primary">
        <v-list-item>
          <v-list-item-title class="title">{{
            user?.name ?? ""
          }}</v-list-item-title>
          <v-list-item-subtitle>{{ user?.email ?? "" }}</v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-list color="primary">
        <v-list-item
          href="javascritp:void(0)"
          @click="doAction(menuItem.action, menuItem.link)"
          v-for="(menuItem, menuItemId) in menu"
          v-bind:key="menuItemId"
        >
          <template v-slot:prepend>
            <v-icon :icon="menuItem.icon"></v-icon>
          </template>

          <v-list-item-title>{{ $t(menuItem.title) }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-list>
  </v-navigation-drawer>

  <v-app-bar color="primary" prominent>
    <template v-slot:prepend>
      <v-app-bar-nav-icon
        v-if="!hideTopBar && showMenu"
        @click.stop="showNavigation = !showNavigation"
      ></v-app-bar-nav-icon>
    </template>

    <v-toolbar-title v-if="!hideTitle">{{ $t(title) }}</v-toolbar-title>

    <dynamic :options="topBar" v-if="$route.meta.topBarLeft" />

    <template v-slot:append v-if="!$route.meta.topBarLeft">
      <dynamic :options="topBar" />
    </template>
  </v-app-bar>
</template>
<script lang="ts">
import Dynamic from "@/components/layout/Dynamic.vue";
import User from "@/domain/user";

export default {
  components: {
    Dynamic,
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
      title: this.$route.meta.title,
      showMenu: this.$route.meta.showMenu,
    };
  },
  methods: {
    doAction(action: string, param: string) {
      if (action === "goTo") {
        this.goTo(param);
      } else if (action === "logout") {
        this.logout();
      } else if (action === "reload") {
        // @ts-ignore
        window.location.reload(true);
      }
    },
    goTo(link: string) {
      this.showNavigation = false;
      this.$router.push(link);
    },
    logout() {
      User.logout();
    },
  },
};
</script>
<style></style>
