<template>
  <div id="container">
    <v-app>
      <tool-bar :showMenu="showMenu"></tool-bar>

      <div class="content">
        <router-view />
        <portal-target name="portal-loadable"></portal-target>
      </div>
      <portal-target name="portal-menu"></portal-target>
    </v-app>
  </div>
</template>

<script>
import ToolBar from 'src/components/layout/ToolBar';

export default {
  name: 'app',
  components: {
    ToolBar,
  },
  data() {
    return {
      showMenu: this.$router.options.appOptions.showMenu,
    };
  },
};
</script>
