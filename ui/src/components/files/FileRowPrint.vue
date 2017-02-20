<template>
  <div class="line" :class=[type]>
    <file-block-print
      v-for="(block,index) in line"
      :block="block"
      :pinyin="block.p"
      :character="block.c"
      :isBold="block.isBold"
      :highlight="block.h"
      :line-index="lineIndex"
      :block-index="index"
      @open-modal="openModal"
      >
    </file-block-print>

    <div class="clearfix"></div>
  </div>
</template>

<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';

  export default {
    name: 'file-row',
    components: {
      FileBlockPrint,
    },
    data() {
      return {
        type: '',
      };
    },
    props: {
      line: {
        type: Array,
        default: () => ([]),
      },
      lineIndex: {
        default: 0,
      },
    },
    created() {
      if (this.line[0] !== undefined && this.line[0].line !== undefined) {
        const type = this.line[0].line.type;
        this.type = `type-${type}`;
      }
    },
    methods: {
      openModal(add) {
        this.$emit('open-modal', add);
      },
    },
  };
</script>
