<template>
  <div>
    <div class="tab-header-container">
      <div
        v-for="(label, tabId) in labels"
        v-bind:key="tabId"
        class="tab-header"
        :class="['tab-header', (tabSelectedId === tabId) ? 'selected' : '']"
        @click="selectTab(tabId)"
      >{{ label }}</div>
    </div>
    <div>
      <div class="tab-content-container">
        <slot :tabSelectedId="tabSelectedId"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data() {
    return { labels: [], items: [], tabSelectedId: 0 };
  },
  mounted() {
    const labels = [];
    const items = [];

    for (const tab of this.$slots.default) {
      const tabProps = tab.componentOptions.propsData;
      labels.push(tabProps.label);

      items.push(tab.componentOptions.children);
    }

    this.labels = labels;
    this.items = items;

    this.$slots.default[0].componentInstance.setShow(true);
  },
  methods: {
    selectTab(tabId) {
      let id = 0;
      for (const component of this.$slots.default) {
        component.componentInstance.setShow(id === tabId);
        id++;
      }

      this.tabSelectedId = tabId;
    },
  },
};
</script>


<style scoped>
.tab-header-container {
  background-color: #fff;
  display: flex;
  width: 100%;
  -webkit-mask-image: radial-gradient(circle, #fff 100%, #000 0);
}

.tab-header {
  cursor: pointer;
  color: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  text-transform: uppercase;
  user-select: none;
}

.tab-header:hover {
  transition: all 1s ease;
  background-color: #e7e7e7 !important;
}

.tab-header.selected {
  background-color: #e7effd !important;
  border-bottom: 2px solid #448aff;
  color: #448aff;
  transition: all 0.5s ease;
}

.tab-header.selected:hover {
  background-color: #e7effd !important;
}

.tab-content-container {
  padding-top: 5px;
}
</style>
