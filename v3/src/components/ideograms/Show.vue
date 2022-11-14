<template>
  <div class="ideogram-show">
    <span
      v-for="(data, index) in printData"
      :class="[
        data.ideogramClass,
        highlights && highlights[index] ? 'highlight' : '',
      ]"
      :style="{ color: data.toneColor }"
      v-bind:key="index"
      >{{ data.character }}</span
    >
  </div>
</template>

<script lang="ts">
import ideogramsShow from "@/helpers/ideograms.show";
export default {
  name: "ideograms-show",
  data() {
    return {
      printData: [],
    };
  },
  props: {
    useSpaces: false,
    pinyin: "",
    character: "",
    highlights: {},
  },
  created() {
    this.updateRender();
  },
  methods: {
    updateRender() {
      this.printData = ideogramsShow(this);
    },
  },
};
</script>
<style>
.ideogram-show {
  display: inline-block;
}

.no-ideogram {
  width: auto !important;
}

.highlight {
  background: rgb(5, 205, 255);
}
</style>
