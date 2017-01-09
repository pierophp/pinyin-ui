<template>
  <div class="line bs-callout bs-callout-primary">
    <file-block
      v-for="(block,index) in line"
      :pinyin="block.p"
      :character="block.c"
      :line-index="lineIndex"
      :block-index="index"
      >
    </file-block>

    <file-row-actions :line-index="lineIndex" @open-file-paste-modal="$emit('open-file-paste-modal')"></file-row-actions>

    <div class="clearfix"></div>
  </div>
</template>

<script>
  import FileBlock from 'src/components/files/FileBlock';
  import FileRowActions from 'src/components/files/FileRowActions';

  export default {
    name: 'file-row',
    components: {
      FileBlock,
      FileRowActions,
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
  };
</script>
