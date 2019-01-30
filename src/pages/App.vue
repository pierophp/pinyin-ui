<template>
  <div id="container">
    <tool-bar :showMenu="showMenu"></tool-bar>

    <div class="content">
      <router-view/>
    </div>
    <portal-target name="portal"></portal-target>
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
