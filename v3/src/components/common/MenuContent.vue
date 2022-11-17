<template>
  <div class="menu-container">
    <div @click="openMenu">
      <slot name="click"></slot>
    </div>

    <portal to="portal-menu">
      <div class="menu" v-if="show" v-bind:style="menuStyle">
        <slot></slot>
      </div>
    </portal>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
export default {
  name: "menu-content",
  data() {
    return {
      show: false,
      menuStyle: {},
      opening: false,
      top: null,
      left: null,
    };
  },
  props: {
    position: null,
  },
  mounted() {
    document.addEventListener("click", this.hideOnClickOutside);
  },
  destroy() {
    document.removeEventListener("click", this.hideOnClickOutside);
  },
  methods: {
    hideOnClickOutside(e: any) {
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
      let top = e.clientY;
      if (this.position === "top") {
        top = top - 217;
      } else {
        top = top - 30;
      }

      let left = e.clientX - 190;

      if (left < 3) {
        left = 3;
      }

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
  max-height: 200px;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 10px 0;
  position: fixed;
  width: 220px;
  z-index: 1000000;
}

.menu .icon i {
  color: rgba(0, 0, 0, 0.54) !important;
}
</style>
