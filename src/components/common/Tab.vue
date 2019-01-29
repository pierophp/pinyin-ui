<template>
  <div v-show="show">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'tab',
  data() {
    return {
      show: false,
    };
  },
  props: {
    label: '',
  },
  methods: {
    setShow(show) {
      this.show = show;
    },
  },
};
</script>


