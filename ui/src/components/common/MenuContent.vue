<template>
  <div>
    <div @click="openMenu">
      <slot name="click"></slot>
    </div>

    <div class="menu" v-if="show" v-bind:style="menuStyle">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'menu-content',
  data() {
    return { show: false, menuStyle: {}, opening: false };
  },
  props: {
    top: null,
    left: null,
  },
  mounted() {
    document.addEventListener('click', this.hideOnClickOutside);
  },
  destroy() {
    document.removeEventListener('click', this.hideOnClickOutside);
  },
  methods: {
    hideOnClickOutside(e) {
      if (this.opening) {
        return;
      }

      if (this.show) {
        this.show = false;
      }
    },
    openMenu(e) {
      this.opening = true;

      this.show = true;
      const top = e.pageY - 30;
      const left = e.pageX - 180;

      this.menuStyle.top = `${top}px`;
      this.menuStyle.left = `${left}px`;

      setTimeout(() => {
        this.opening = false;
      }, 100);
    },
  },
};
</script>

<style scoped>
.menu {
  background: #ffffff;
  color: #000000;
  width: 200px;
  position: absolute;
  z-index: 1000000;
  padding: 10px 0;
}

.menu .icon i {
  color: rgba(0, 0, 0, 0.54) !important;
}
</style>

