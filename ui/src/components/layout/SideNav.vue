<template>
  <md-sidenav @click.native="$refs.sidenav.close()" md-theme="blue" class="md-left" ref="sidenav" md-swipeable>
    <md-toolbar class="md-account-header">
      <md-list class="md-transparent">
        <md-list-item>
          <div class="md-list-text-container">
            <span>{{user.name}}</span>
            <span>{{user.email}}</span>
          </div>

          <md-button class="md-icon-button md-list-action">
            <md-icon>arrow_drop_down</md-icon>
          </md-button>
        </md-list-item>
      </md-list>
    </md-toolbar>

    <md-list >
      <md-list-item>
        <router-link :to="{ name: 'files' }">
          <md-icon>insert_drive_file</md-icon> <span>{{ $t("menu.my_files") }}</span>
        </router-link>
      </md-list-item>

      <md-list-item>
        <router-link :to="{ name: 'my-cjk' }">
          <md-icon>translate</md-icon> <span>{{ $t("menu.my_ideograms") }}</span>
        </router-link>
      </md-list-item>

      <md-list-item>
        <router-link :to="{ name: 'config' }">
          <md-icon>settings</md-icon> <span>{{ $t("menu.settings") }}</span>
        </router-link>
      </md-list-item>

      <md-list-item @click.native="logout()">
        <md-icon>power_settings_new</md-icon> <span>{{ $t("menu.logout") }}</span>
      </md-list-item>
    </md-list>
  </md-sidenav>
</template>

<script>
  import User from 'src/domain/user';

  export default {
    name: 'side-nav',
    data() {
      return {
        user: User.getUser(),
      };
    },
    methods: {
      logout() {
        User.logout();
      },
    },
  };
</script>

<style>
  .md-toolbar.md-account-header{
    min-height: 0;
  }

  .md-sidenav-content {
    background-color: #fff;
    color: rgba(0, 0, 0, .87);
  }
</style>
