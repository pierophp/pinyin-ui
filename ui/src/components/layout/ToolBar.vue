<template>
  <md-whiteframe md-tag="md-toolbar" md-elevation="2" md-theme="deep-purple" class="md-dense">
    <div class="md-toolbar-container">
      <md-button class="md-icon-button" @click="$emit('toggle-sidebar')">
        <md-icon>menu</md-icon>
      </md-button>
      <h2 class="md-title">Simple Pinyin Editor</h2>
      <span style="flex: 1"></span>
      <dynamic :template="dynamicTemplate" :data="dynamicData" />

    </div>
  </md-whiteframe>
</template>
<script>
  import Dynamic from 'src/components/layout/dynamic';

  export default {
    components: {
      Dynamic,
    },
    watch: {
      $route() {
        this.dynamicTemplate = this.$route.meta.topBar;
      },
    },
    data() {
      return {
        dynamicTemplate: this.$route.meta.topBar,
        dynamicData: {
          name: 'Piero',
        },
      };
    },
  };
</script>
