<template>
  <div
    v-show="visible"
    :style="getStyle"
    class="loader"
    >
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: '#d74e43',
    },

    visible: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    getStyle() {
      return {
        'border-color': this.color || false,
      };
    },
  },
};
</script>

<style scoped>
@keyframes loader {
  0% {
    transform: rotateZ(0deg);
  }

  100% {
    transform: rotateZ(360deg);
  }
}

.loader {
  width: 24px;
  height: 24px;
  border-width: 5px;
  border-style: solid;
  border-top-color: transparent !important;
  border-radius: 50%;
  animation-name: loader;
  animation-duration: .6s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  display: inline-block;
}

.loader.darker {
  border-color: rgba(0, 0, 0, .4);
  border-top-color: transparent;
}
</style>
