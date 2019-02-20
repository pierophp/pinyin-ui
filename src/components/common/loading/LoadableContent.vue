<template>
  <div class="loadable-content">
    <portal to="portal-loadable" v-if="portal">
      <div class="loadable-loader" v-show="loading">
        <md-progress-spinner class="md-accent" md-mode="indeterminate" :visible="loading"></md-progress-spinner>
      </div>
    </portal>

    <div class="loadable-loader" v-show="loading" v-if="!portal">
      <md-progress-spinner class="md-accent" md-mode="indeterminate" :visible="loading"></md-progress-spinner>
    </div>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'loadable-content',

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    portal: {
      type: Boolean,
      default: true,
    },
  },
};
</script>

<style scoped>
.loadable-content {
  position: relative;
  min-height: 48px;
}

.loadable-loader {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.md-spinner {
  position: fixed;
  top: 200px;
}
</style>
