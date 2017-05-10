<template>
  <div class="line" :class=[type] v-show="rowVisible">
    <file-row-translation :line="line" />
    <file-block-print
      v-for="(block,index) in line"
      :block="block"
      :pinyin="block.p"
      :character="block.c"
      :isBold="block.isBold"
      :highlight="block.h"
      :line-index="lineIndex"
      :block-index="index"
      :key="index"
      @open-image="openImage"
      @open-footnote="openFootnote"
      >
    </file-block-print>

    <div class="clearfix"></div>
  </div>
</template>

<script>
  import FileBlockPrint from 'src/components/files/FileBlockPrint';
  import FileRowTranslation from 'src/components/files/FileRowTranslation';

  export default {
    name: 'file-row',
    components: {
      FileBlockPrint,
      FileRowTranslation,
    },
    data() {
      return {
        type: '',
        rowVisible: true,
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
        if (type === 'foot') {
          this.rowVisible = true;
        }
      }
    },
    methods: {
      openImage(image) {
        this.$emit('open-image', image);
      },
      openFootnote(footnote) {
        this.$emit('open-footnote', footnote);
      },
    },
  };
</script>
