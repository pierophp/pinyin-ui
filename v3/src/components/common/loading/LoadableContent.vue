<template>
  <div class="loadable-content">
    <Teleport to="#portal-loadable" v-if="portal">
      <div class="loadable-loader" v-show="loading">
        <v-progress-circular
          color="primary"
          indeterminate
          :size="62"
          :width="8"
          :visible="loading"
        ></v-progress-circular>
      </div>
    </Teleport>

    <div class="loadable-loader" v-show="loading" v-if="!portal">
      <v-progress-circular
        color="primary"
        indeterminate
        :size="62"
        :width="8"
        :visible="loading"
      ></v-progress-circular>
    </div>

    <slot></slot>
  </div>
</template>

<script lang="ts">
export default {
  name: "loadable-content",

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
