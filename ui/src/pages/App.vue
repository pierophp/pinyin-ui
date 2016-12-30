<template>
  <div id="container">
  <tool-bar @toggle-sidebar="toggle()"></tool-bar>

  <div class="content">
    <transition name="fade-page">
        <keep-alive>
          <router-view />
      </keep-alive>
    </transition>
  </div>

  <side-nav ref="sidenav"></side-nav>
</div>
</template>

<script>
  import ToolBar from 'src/components/layout/ToolBar';
  import SideNav from 'src/components/layout/SideNav';

  export default {
    name: 'app',

    components: {
      ToolBar,
      SideNav,
    },
    created() {
      console.log(this.$route.meta.topBar);
    },
    methods: {
      toggle() {
        this.$refs.sidenav.$refs.sidenav.toggle();
      },
    },
  };
</script>

<style>


</style>
