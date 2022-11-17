<template>
  <div class="ideogram-show">
    <ideograms-show
      :pinyin="pinyin"
      :character="ideograms"
      :highlights="highlights"
      ref="first-ideogram-show"
    />
    <template v-if="secondOnlyDiff"
      >[
      <ideograms-show
        :pinyin="pinyin"
        :character="secondOnlyDiff"
        ref="second-ideogram-show"
      />]
    </template>
  </div>
</template>

<script lang="ts">
// @ts-nocheck
import IdeogramsShow from "@/components/ideograms/Show.vue";

export default {
  name: "traditional-simplified-show",
  components: {
    IdeogramsShow,
  },
  props: {
    pinyin: "",
    ideograms: "",
    highlights: {},
    variants: Array,
  },
  watch: {
    ideograms() {
      if (this.$refs["first-ideogram-show"]) {
        this.$nextTick(() => {
          this.$refs["first-ideogram-show"].updateRender();
        });
      }
    },
    secondOnlyDiff() {
      if (this.$refs["second-ideogram-show"]) {
        this.$nextTick(() => {
          this.$refs["second-ideogram-show"].updateRender();
        });
      }
    },
  },
  computed: {
    secondOnlyDiff() {
      const secondWithDiffList = [];
      if (!this.variants) {
        return "";
      }

      for (const variant of this.variants) {
        const total = variant.length;
        let secondWithDiff = "";
        for (let i = 0; i < total; i += 1) {
          const firstChar = this.ideograms[i];
          const secondChar = variant[i];

          if (firstChar === secondChar) {
            secondWithDiff += "-";
          } else {
            secondWithDiff += secondChar;
          }
        }
        secondWithDiffList.push(secondWithDiff);
      }

      return secondWithDiffList.join("/");
    },
  },
};
</script>
