<template>
  <div class="line bs-callout bs-callout-primary">
    <file-block
      v-for="(block, index) in line"
      v-bind:key="index"
      :pinyin="block.p"
      :character="block.c"
      :line-index="lineIndex"
      :block-index="index"
      :block="block"
    >
    </file-block>

    <file-row-actions
      :line-index="lineIndex"
      @open-file-paste-modal="$emit('open-file-paste-modal')"
    ></file-row-actions>

    <div class="clearfix"></div>
  </div>
</template>

<script>
import FileBlock from "@/components/files/FileBlock";
import FileRowActions from "@/components/files/FileRowActions";

export default {
  name: "file-row",
  components: {
    FileBlock,
    FileRowActions,
  },
  props: {
    line: {
      type: Array,
      default: () => [],
    },
    lineIndex: {
      default: 0,
    },
  },
};
</script>

<style>
.image-edit img {
  max-height: 150px;
}
</style>
