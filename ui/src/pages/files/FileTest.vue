<template>
  <div class="phone-viewport template">

  <tool-bar @toggle-sidebar="toggle()"></tool-bar>

  <md-list class="md-double-line">
    <md-subheader class="md-inset">Folders</md-subheader>

    <md-list-item>
      <md-avatar class="md-avatar-icon">
        <md-icon>folder</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Photos</span>
        <p>Jan 9, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item>
      <md-avatar class="md-avatar-icon">
        <md-icon>folder</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Recipes</span>
        <p>Jan 17, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item>
      <md-avatar class="md-avatar-icon">
        <md-icon>folder</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Work</span>
        <p>Jan 28, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>

      <md-divider class="md-inset"></md-divider>
    </md-list-item>

    <md-subheader class="md-inset">Files</md-subheader>

    <md-list-item>
      <md-avatar md-theme="light-blue" class="md-avatar-icon md-primary">
        <md-icon>insert_drive_file</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Vacation Itinerary</span>
        <p>Jan 20, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item>
      <md-avatar md-theme="orange" class="md-avatar-icon md-primary">
        <md-icon>collections</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Kitchen Remodel</span>
        <p>Jan 10, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item>
      <md-avatar md-theme="green" class="md-avatar-icon md-primary">
        <md-icon>view_list</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Grocery Shop</span>
        <p>Jan 10, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>

    <md-list-item>
      <md-avatar md-theme="orange" class="md-avatar-icon md-primary">
        <md-icon>collections</md-icon>
      </md-avatar>

      <div class="md-list-text-container">
        <span>Weekend Pictures</span>
        <p>Jan 10, 2014</p>
      </div>

      <md-button class="md-icon-button md-list-action">
        <md-icon>info</md-icon>
      </md-button>
    </md-list-item>
  </md-list>

  <side-nav ref="sidenav"></side-nav>

  <md-button class="md-fab md-fab-bottom-right md-mini">
      <md-icon>add</md-icon>
  </md-button>
</div>
</template>

<script>
  import ToolBar from 'src/components/layout/ToolBar';
  import SideNav from 'src/components/layout/SideNav';

  export default {
    name: 'file-test',

    components: {
      ToolBar,
      SideNav,
    },
    methods: {
      toggle() {
        this.$refs.sidenav.$refs.sidenav.toggle();
      },
    },
  };
</script>

<style>
  .template {
    height: 540px;
    display: flex;
    flex-flow: column;
    position: relative;
    overflow: hidden;
    z-index: 1;
  }

  .template .md-list {
    overflow: auto;
  }
</style>
